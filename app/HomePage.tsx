"use client"
import {useState} from "react";
import styled from "styled-components";
import createNewUrl from "@/components/createNewUrl";

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: 5% auto; 
    padding: 2%; 
    background-color: azure;
    border: black solid 2px; 
`;

const StyledH1 = styled.h1`
    text-align: center;
    background-color: lightblue;
    padding: 1%; 
`;

const StyledLabel = styled.label`
    font-weight: bold;
    font-size: calc(2px + 1.2vw);
    padding: 1%; 
`;

const StyledInput = styled.input`
    padding: 1%;
    margin: 1%;
`;

const StyledButton = styled.button`
    width: 40%;
    padding: 1%;
    margin: auto; 
    background-color: steelblue;
    color: white; 
    font-weight: bold; 
`;

const StyledButton2 = styled.button`
    width: 20%;
    padding: 1%;
    background-color: white;
    color: steelblue; 
    border: steelblue 1px solid;
    font-weight: bold; 
`;

const StyledPRed = styled.p`
    color: red;
    padding: 2%;
    text-align: center;
    font-size: calc(2px + 1.2vw);
`;

const StyledDiv2 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1%;
    gap: 2%; 
    font-size: calc(2px + 1.2vw);
    background-color: lightblue;
    border: gray 0.5px solid;
    padding: 1%; 
`;

const StyledP2 = styled.p`
    font-size: calc(2px + 1.3vw);
    font-weight: bold;
    padding-top: 2%; 
    
`;

const StyledH3 = styled.h2`
    font-size: calc(2px + 1.5vw);
    color: steelblue;
    padding: 2%;
    text-align: center;
`;

export default function HomePage(){
    const[url, setUrl] = useState("");
    const[alias, setAlias] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");
    const[shortUrl, setShortUrl] = useState("");

    const Submit = async () => {
        console.log("url:", url);
        console.log("alias:", alias);

        setErrorMessage(""); //To clear previous error messages
        setShortUrl("");
        setSuccessMessage("");
        try{
            const result = await createNewUrl(alias, url);
            const newShortUrl = `${window.location.origin}/${result.data!.alias}`; //the window.location.origin gets the website's current domain
            setShortUrl(newShortUrl);
            setSuccessMessage("Your URL has been created!");
            console.log("result:", result);
        } catch(error){
            if (error instanceof Error) {
                setErrorMessage(error.message); //this shows specific error message i account for in my createNewUrl.ts
            } else{
                setErrorMessage("Something went wrong.");
            }
        }
    }

    const Copy = async () => {
        try{
            await navigator.clipboard.writeText(shortUrl);
            setSuccessMessage("URL copied!");
        } catch (error) {
            setErrorMessage("Unable to copy URL.")
        }
    }

    return(
        <>
            <StyledH1>CS303 URL Shortener</StyledH1>
            <StyledH3>Shorten your long URLs into compact, shareable links</StyledH3>
            <StyledDiv>
                <StyledLabel htmlFor="url">Enter your original URL:</StyledLabel>
                <StyledInput type="text" id="url" placeholder="Eneter your original URL" value={url} onChange={(e)=>setUrl(e.target.value)}/>
                <StyledLabel htmlFor="alias">Choose your custom alias:</StyledLabel>
                <StyledInput type="text" id="alias" placeholder="my-link" value={alias} onChange={(e)=>setAlias(e.target.value)}/>
                <StyledButton type="button" onClick={Submit}>Create URL</StyledButton>
                {errorMessage && <StyledPRed>{errorMessage}</StyledPRed>} {/*Only display if there's an error*/}
                {shortUrl && (
                    <>
                        <StyledP2>Your shortened URL: </StyledP2>
                        <StyledDiv2>
                        <a href={shortUrl} target="_blank">{shortUrl}</a>
                        <StyledButton2 type="button" onClick={Copy}>Copy URL</StyledButton2>
                        </StyledDiv2>
                    </>)}
            </StyledDiv>
        </>
    )
}