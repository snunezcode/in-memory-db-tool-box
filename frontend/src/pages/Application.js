import {useState,useEffect} from 'react'
import { createSearchParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Axios from 'axios'
import { configuration, modulesInfo, SideMainLayoutHeader,SideMainLayoutMenu, breadCrumbs } from './Configs';

import CustomHeader from "../components/HeaderApp";
import AppLayout from "@cloudscape-design/components/app-layout";
import SideNavigation from '@cloudscape-design/components/side-navigation';
import Container from "@cloudscape-design/components/container";

import Header from "@cloudscape-design/components/header";
import '@aws-amplify/ui-react/styles.css';


//-- Application Objects
import AppObjCounter from "../components/AppObjCounter";
import AppObjMonitor from "../components/AppObjMonitor";


function Application() {
  

  //-- Gather Parameters
  const [params] = useSearchParams();
  var paramCodeId = params.get("codeid");
    
  console.log(paramCodeId);
  
  if (paramCodeId == null)
    paramCodeId = "default";

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
                {paramCodeId != "default"  && (
                                <Container
                                    header={
                                        <Header
                                          variant="h2"
                                          description={modulesInfo[paramCodeId].description}
                                        >
                                          {modulesInfo[paramCodeId].title}
                                        </Header>
                                      }
                                >
                                <table style={{"width":"100%"}}>
                                    <tr>
                                        <td style={{"width":"70%", "text-align":"left", "padding-right": "1em",}} >  
                                                  
                                                      {paramCodeId === "dt01" && (
                                                        
                                                        <AppObjCounter apiUrl={configuration["apps-settings"]["api-url"]} />
                                                        
                                                      )}
                                           
                                        </td>
                                        <td style={{"width":"30%", "text-align":"left", "padding-left": "2em","border-left": "2pt solid red"}} >  
                                                    <AppObjMonitor />
                                        </td>
                                    </tr>
                                </table>
                               
                               </Container>
                )}
                </>
                
            }
          />
        
    </div>
  );
}

export default Application;

