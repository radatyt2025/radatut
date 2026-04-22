'use client';

import React from 'react';

import type { Message } from '@/store/chatbot/chatbot.api';

import { chatLabels } from '@/constants/home/chat-bot';
import styles from '@/css/chat-bot.module.css';
import { useSendMessageMutation } from '@/store/chatbot/chatbot.api';

import { Button } from '../ui/button';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const { reply, error } = await sendMessage({
        message: input,
        history: messages,
      }).unwrap();

      if (reply) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: error || 'Something went wrong.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: unknown) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Failed to connect to the server.',
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(String(error));
    }
  };
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{chatLabels.title}</h2>
          <p className={styles.subtitle}>
            {chatLabels.subtitle}          </p>
        </div>

        <div className={styles.chatBox}>
          <div className={styles.messagesContainer} ref={scrollRef}>
            <div className={styles.userMessageRow}>
              <div className={styles.userBubble}>
                У якого університету найкраща студрада? Га?
              </div>
            </div>

            <div className={styles.botMessageRow}>
              <div className={styles.avatar}>P</div>
              <div className={styles.botBubble}>
                Найкраща студентська рада, згідно реакціям та відгукам молоді,
                якщо встати спиною до сонця та лицем до Львівських круасанів -
                студрада ІТ СТЕПу! У них навіть є свій сайт, та членом може
                стати кожен, хто хоче розвиватися. Можливо, ти маєш ще якісь
                запитання? Я з радістю допоможу тобі зорієнтуватися, та підкажу,
                де знайти інформацію.
              </div>
            </div>
            {messages.map(({ id, role, content }) =>
              role === 'user' ? (
                <div key={id} className={styles.userMessageRow}>
                  <div className={styles.userBubble}>{content}</div>
                </div>
              ) : (
                <div key={id} className={styles.botMessageRow}>
                  <div className={styles.avatar}>P</div>
                  <div className={styles.botBubble}>{content}</div>
                </div>
              ),
            )}
            {isLoading && (
              <div className={styles.botMessageRow}>
                <div className={styles.avatar}>{chatLabels.botAvatar}</div>
                <div className={styles.loadingBubble}>{chatLabels.loadingText}</div>
              </div>
            )}
          </div>

          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) =>
                event.key === 'Enter' && handleSendMessage()
              }
              disabled={isLoading}
              placeholder={chatLabels.inputPlaceholder}
              className={styles.inputField}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}>
              {chatLabels.sendButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
