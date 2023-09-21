import React, { useState, useEffect, useRef } from 'react';
import { configuration } from '../pages/Configs';
import Container from "@cloudscape-design/components/container";

const formatDateWithMilliseconds = (timestampInSeconds) => {
    const date = new Date(timestampInSeconds * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour12: false })}.${date.getMilliseconds().toString().padStart(3, '0')}`;
}


function Monitor() {
    console.log("Monitor rendered");  // <-- Add this line here

    const [commands, setCommands] = useState([]);
    const wsRef = useRef();

    useEffect(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // If the WebSocket is already open, don't try to open another connection.
            return;
        }
        setTimeout(() => {
        wsRef.current = new WebSocket(configuration['apps-settings']['socket-url']);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected.');
        };

        wsRef.current.onmessage = (message) => {
            const { time, args } = JSON.parse(message.data);
            console.log(`Received command from server: ${args}`);
            const formattedCommand = `${formatDateWithMilliseconds(time)} - ${args.join(' ')}`;
            setCommands(prevCommands => {
                const newCommands = [...prevCommands, formattedCommand];
                return newCommands.slice(-30);  // keep only the last 9 commands
            });
        };
        

        wsRef.current.onerror = (error) => {
            console.error(`WebSocket Error: ${error}`);
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket closed.');
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        }}, 1000); // waits 1 second before attempting to connect
    }, []);

    return (
        <div>
            <Container>
                    
            <h3>Redis Monitor Command Output</h3>
   
                <div style={{"overflow-y":"scroll", "overflow-y":"auto", "height": "600px"}}>  
                        {commands.map((command, index) => (
                            <div className="command" key={index}>{command}</div>
                        ))}
          
                </div>
            </Container>
        </div>
);
}

export default Monitor;
