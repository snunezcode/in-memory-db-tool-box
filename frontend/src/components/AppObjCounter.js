import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import ExpandableSection from "@cloudscape-design/components/expandable-section";



function AppComponent({ apiUrl }) {
  
    //-- Add token protection
    axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
    
    const [count, setCount] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [showCode, setShowCode] = useState(false);

    const toggleCode = () => {
      setShowCode((prevState) => !prevState);
    };



  //-- Init Object
  useEffect(() => {
      axios.get(`${apiUrl}/api/counter/default`).then((response) => {
        setCount(response.data.value);
      });
  }, []);


  //-- Increment
  const increment = ({ increment }) => {
    
      axios.post(`${apiUrl}/api/counter/increment`, { value: increment })
      .then((response) => {
        setCount(response.data.value);
      });
    
  };


  //-- Decrement
  
  const decrement = ({ decrement }) => {
    
        axios.post(`${apiUrl}/api/counter/decrement`, { value: decrement })
          .then((response) => {
            setCount(response.data.value);
          });
          
  };


  //-- IncrementBy
  const incrementBy = ({ increment }) => {
    
      axios.post(`${apiUrl}/api/counter/incrementBy`, { value: increment }).then((response) => {
        setCount(response.data.value);
      });
      
  };


  //-- DecrementBy
  const decrementBy = ({ decrement }) => {
    
      axios.post(`${apiUrl}/api/counter/decrementBy`, { value: decrement }).then((response) => {
        setCount(response.data.value);
      });
    
  };


  //-- SetCounter
  const setCounter = () => {
    
      axios.post(`${apiUrl}/api/counter/setCounter`, {
          value: parseFloat(inputValue),
        })
        .then((response) => {
          setCount(response.data.value);
          setInputValue(""); // clear the input box
        });
        
  };


  return (
    
    <>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <table style={{"width":"100%"}}>
              <tr>
                  <td style={{"width":"100%", "text-align":"center"}} >  
                      <span style={{"font-size": "72px", "font-weight": "500","font-family": "Arial", }}>
                          {count}
                      </span>
                  </td>   
              </tr>    
    </table>
    <br/>
    <br/>
    <br/>
     <ColumnLayout columns={4} variant="text-grid">
      <div>
          <Button variant="primary" onClick={increment}>Increment</Button>
      </div>
      <div>
          <Button variant="primary" onClick={decrement}>Decrement</Button>
      </div>
      <div>
          <Button variant="primary" onClick={incrementBy}>Increment +10</Button>
      </div>
      <div>
          <Button variant="primary" onClick={decrementBy}>Decrement +10</Button>
      </div>
    </ColumnLayout>
    
    <ColumnLayout columns={2} variant="text-grid">
      <div>
          <table style={{"width":"350px"}}>
              <tr>
                  <td style={{"width":"150px", "text-align":"left"}} >  
                      <Button variant="primary" onClick={setCounter} >Set Counter Value</Button>
                      
                  </td>    
                  <td style={{"width":"130px", "text-align":"left"}} >  
                      <Input
                        onChange={({ detail }) => setInputValue(detail.value)}
                        value={inputValue}
                        placeholder="Set Counter Value"
                      />
                  </td>    
              </tr>    
          </table>    
      </div>
    </ColumnLayout>
    <br/>
    <ExpandableSection headerText="Example Code">
      
          <pre style={{padding: "10px",borderRadius: "8px",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",whiteSpace: "pre-wrap",overflowWrap: "anywhere",background: "#f7f7f7",}}>
            <code>
              {" "}
{`
      // Fetch the counter value from Redis
      app.get('/counter', (req, res) => {
          client.get('counter', (err, reply) => {
              if (err) return res.status(500).json({ error: 'Failed to fetch counter' });
              res.json({ value: parseInt(reply || '0', 10) });
          });
      });
      
      // Increment the counter using Redis INCR
      app.post('/increment', (req, res) => {
          client.incr('counter', (err, reply) => {
              if (err) return res.status(500).json({ error: 'Failed to increment counter' });
              res.json({ value: parseInt(reply, 10) });
          });
      });
      
      // Decrement the counter using Redis DECR
      app.post('/decrement', (req, res) => {
          client.decr('counter', (err, reply) => {
              if (err) return res.status(500).json({ error: 'Failed to decrement counter' });
              res.json({ value: parseInt(reply, 10) });
          });
      });
      
      // Set counter value in Redis
      app.post('/setCounter', (req, res) => {
          const value = req.body.value;
          client.set('counter', value, (err, reply) => {
              if (err) return res.status(500).json({ error: 'Failed to set counter' });
              res.json({ value: parseInt(value, 10) });
          });
  });`}
                {" "}
            </code>{" "}
          </pre>{" "}
          
          
    </ExpandableSection>
    
    
    </>
  );
}

export default AppComponent;
