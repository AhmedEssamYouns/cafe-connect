import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { AiFillBackward, AiFillCaretLeft, AiFillMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messages";
import { isLoggedIn } from "../helpers/authHelper";
import { socket } from "../helpers/socketHelper";
import Loading from "./Loading";
import Message from "./Message";
import SendMessage from "./SendMessage";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Messages = (props) => {
  const messagesEndRef = useRef(null);
  const user = isLoggedIn();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const conversationsRef = useRef(props.conversations);
  const conservantRef = useRef(props.conservant);

  // Use a ref to keep track of previous messages
  const previousMessagesRef = useRef([]);

  useEffect(() => {
    conversationsRef.current = props.conversations;
    conservantRef.current = props.conservant;
  });

  const conversation =
    props.conversations &&
    props.conservant &&
    props.getConversation(props.conversations, props.conservant._id);

  const setDirection = (messages) => {
    messages.forEach((message) => {
      if (message.sender._id === user.userId) {
        message.direction = "from";
      } else {
        message.direction = "to";
      }
    });
  };

  const fetchMessages = async () => {
    if (conversation) {
      if (conversation.new) {
        setLoading(true); 
        setMessages(conversation.messages);
        return;
      }
  
      if (JSON.stringify(messages) !== JSON.stringify(conversation.messages)) {
        setLoading(false); 
        const data = await getMessages(user, conversation._id);
        setDirection(data);
  
        if (data && !data.error) {
          setMessages(data);
        }
  
        setLoading(false); 
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [props.conservant]);

  useEffect(() => {
    if (messages) {
      // scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSendMessage = async (content) => {
    const newMessage = { direction: "from", content };
    const newMessages = [newMessage, ...messages];

    if (conversation.new) {
      conversation.messages = [...conversation.messages, newMessage];
    }

    let newConversations = props.conversations.filter(
      (conversationCompare) => conversation._id !== conversationCompare._id
    );

    newConversations.unshift(conversation);
    props.setConversations(newConversations);
    setMessages(newMessages);

    await sendMessage(user, newMessage, conversation.recipient._id);

    socket.emit(
      "send-message",
      conversation.recipient._id,
      user.username,
      content
    );
  };

  const handleReceiveMessage = (senderId, username, content) => {
    const newMessage = { direction: "to", content };
    const conversation = props.getConversation(
      conversationsRef.current,
      senderId
    );

    if (conversation) {
      let newMessages = [newMessage];
      if (messages) {
        newMessages = [...newMessages, ...messages];
      }

      setMessages(newMessages);

      if (conversation.new) {
        conversation.messages = newMessages;
      }
      conversation.lastMessageAt = Date.now();

      let newConversations = conversationsRef.current.filter(
        (conversationCompare) => conversation._id !== conversationCompare._id
      );

      newConversations.unshift(conversation);
      props.setConversations(newConversations);
    } else {
      const newConversation = {
        _id: senderId,
        recipient: { _id: senderId, username },
        new: true,
        messages: [newMessage],
        lastMessageAt: Date.now(),
      };
      props.setConversations([newConversation, ...conversationsRef.current]);
    }

    scrollToBottom();
  };

  // Socket listener for incoming messages
  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  // Check for new messages every second
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchMessages();
      if (JSON.stringify(messages) !== JSON.stringify(previousMessagesRef.current)) {
        previousMessagesRef.current = messages;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [messages]); // Ensure messages ref is updated

  return props.conservant ? (
    <>
      {messages && conversation && !loading ? (
        <>
          <HorizontalStack
            alignItems="center"
            spacing={2}
            sx={{ px: 2, height: "60px" }}
          >
            {props.mobile && (
              <IconButton
                onClick={() => props.setConservant(null)}
                sx={{ padding: 0 }}
              >
                <AiFillCaretLeft />
              </IconButton>
            )}
            <UserAvatar
              username={props.conservant.username}
              height={30}
              width={30}
            />
            <Typography>
              <Link to={"/users/" + props.conservant.username}>
                <b>{props.conservant.username}</b>
              </Link>
            </Typography>
          </HorizontalStack>
          <Divider />
          <Box sx={{ height: "calc(100vh - 240px)" }}>
            <Box sx={{ height: "100%" }}>
              <Stack
                sx={{ padding: 2, overflowY: "auto", maxHeight: "100%" }}
                direction="column-reverse"
              >
                <div ref={messagesEndRef} />
                {messages.map((message, i) => (
                  <Message
                    conservant={props.conservant}
                    message={message}
                    key={i}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
          <SendMessage onSendMessage={handleSendMessage} />
        </>
      ) : (
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Loading />
        </Stack>
      )}
    </>
  ) : (
    <Stack
      sx={{ height: "100%" }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <AiFillMessage size={80} />
      <Typography variant="h5" sx={{
              fontFamily: 'Caveat, cursive',

      }}>CaféConnect Messenger</Typography>
      <Typography color="text.secondary">
        Privately message other users on CaféConnect
      </Typography>
    </Stack>
  );
};

export default Messages;
