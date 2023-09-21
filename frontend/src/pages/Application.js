import {useState,useEffect} from 'react'
import { createSearchParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Axios from 'axios'
import { configuration, SideMainLayoutHeader,SideMainLayoutMenu, breadCrumbs } from './Configs';

import CustomHeader from "../components/HeaderApp";
import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Container from "@cloudscape-design/components/container";
import '@aws-amplify/ui-react/styles.css';


//-- Application Objects
import AppObjCounter from "../components/AppObjCounter";


function Application() {
  

  //-- Gather Parameters
  const [params] = useSearchParams();
  const paramCodeId = params.get("codeid");



  //-- Add Header Cognito Token
  Axios.defaults.headers.common['x-csrf-token'] = sessionStorage.getItem("x-csrf-token");
  Axios.defaults.headers.common['x-token-cognito'] = sessionStorage.getItem("x-token-cognito");
  Axios.defaults.withCredentials = true;
  
 
   //-- Call API to get token
   async function getAuthToken (){

        try{
        
            const { data } = await Axios.get(`${configuration["apps-settings"]["api-url"]}/api/auth/token/`);
            sessionStorage.setItem("x-csrf-token", data.csrfToken );
        }
        catch{
        
          console.log('Timeout API error : /api/auth/token/');                  
          
        }
        
    }
    
   
    // eslint-disable-next-line
    useEffect(() => {
        getAuthToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
  
    
  return (
    <div style={{"background-color": "#f2f3f3"}}>
        <CustomHeader/>
        <AppLayout
            breadCrumbs={breadCrumbs}
            navigation={<SideNavigation items={SideMainLayoutMenu} header={SideMainLayoutHeader} activeHref={"/rds/instances/"} />}
            contentType="table"
            content={
                <>
                
                    <br />
                    <Container>
                      
                      
                      {paramCodeId === "dt01" && (
                        
                        <AppObjCounter apiUrl={configuration["apps-settings"]["api-url"]} />
                        
                      )}
                      
                      
                    </Container>
                      
                </>
                
            }
          />
        
    </div>
  );
}

export default Application;

