import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.less';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import Image from 'next/image';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Message, ChatState } from '../types/chat';
import { streamCompletion } from '../utils/api';

const ChatWindow: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isStreaming: false,
    apiKey: null
  });
  const [input, setInput] = useState('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async () => {
    // 输入框要有值，否则不给提交
    if (!input.trim()) return;
    
    // 输入框提交前，如果还没设置apikey，提示用户输入
    if (!state.apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    const assistantMessage: Message = { role: 'assistant', content: '' };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
      isStreaming: true
    }));

    // 清空输入框
    setInput('');

    let streamedContent = '';
    // 调用api请求并把返回的内容更新到state中
    try {
      await streamCompletion(
        [...state.messages, userMessage],
        state.apiKey,
        (chunk) => {
          streamedContent += chunk;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map((msg, index) => 
              index === prev.messages.length - 1 
                ? { ...msg, content: streamedContent }
                : msg
            )
          }));
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  };

  // 设置apikey，关闭弹窗
  const handleApiKeySubmit = () => {
    if (!tempApiKey.trim()) {
      return;
    }
    setState(prev => ({ ...prev, apiKey: tempApiKey }));
    setShowApiKeyDialog(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ height: '100vh', maxWidth: 1200, margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          m: 2 
        }}
      >
        {
          state.messages.length === 0 && (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <Typography variant="h6" color="text.secondary">
                有什么可以帮忙的？请在下面输入你的问题。
              </Typography>
            </Box>
          )
        }
        {state.messages.map((message, index) => (
            <div className={`chatRecordBox ${message.role}`} key={index}>
              <Avatar sx={{ width: 24, height: 24, borderRadius: 100 }} className="avatar">
                <Image
                  src={message.role === 'user' ? '/you.svg' : '/chatgpt.svg'}
                  alt={message.role === 'user' ? 'User Avatar' : 'ChatGPT Avatar'}
                  width={18}
                  height={18}
                />
              </Avatar>
              <div>
                <p>{message.role === 'user'? 'You' : 'ChatGPT'}</p>
                {message.role === 'assistant' && message.content === '' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#4caf50',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#4caf50',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#4caf50',
                        borderRadius: '50%',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.4s',
                      }}
                    />
                    <style jsx>{`
                      @keyframes pulse {
                        0% { transform: scale(0.8); opacity: 0.5; }
                        50% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(0.8); opacity: 0.5; }
                      }
                    `}</style>
                  </div>
                ) : (
                <p>{message.content}</p>
                )}
              </div>
            </div>
          
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ p: 2, position: 'relative' }}>
        <IconButton 
          color="primary" 
          onClick={handleSend}
          disabled={state.isStreaming || !input}
          sx={{
            position: 'absolute',
            right: 30,
            top: 25,
            zIndex: 1,
            backgroundColor: '#1976d2',
            borderRadius: '10px',
            width: 36,
            height: 36,
            '&:hover': {
              backgroundColor: '#1565c0'
            },
            '&.Mui-disabled': {
              backgroundColor: '#E5E5E5'
            }
          }}
        >
          <ArrowUpwardIcon sx={{ color: '#ffffff' }}/>
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={state.isStreaming}
          placeholder='Message ChatGPT...'
        />
      </Box>

      <Dialog open={showApiKeyDialog} onClose={() => setShowApiKeyDialog(false)}>
        <DialogTitle>输入你的 OpenRouter API Key</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              width: 500,
              borderRadius: '8px',
            }}
            autoFocus
            margin="dense"
            label="API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            error={tempApiKey.trim() === ''}
            helperText={tempApiKey.trim() === '' ? '请输入API Key' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiKeyDialog(false)}>取消</Button>
          <Button onClick={handleApiKeySubmit}>确定</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          API Key 设置成功
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;