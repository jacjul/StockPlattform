import {createContext,useState} from "react"

type LoginPayload ={username:string , password:string }
type AccessTokenResponse = {access_token: string, token_type:string}

type AuthContextProps ={
    accessToken :string
    loggedIn : boolean
    login : (payload:LoginPayload)=>Promise<void>
    logout : ()=>void
    refresh : () => Promise<void>
}
const AuthContext = createContext<AuthContextProps|undefined>(undefined)

async function loginRequest({username,password}:LoginPayload):Promise<AccessTokenResponse>{
    const body = new URLSearchParams();
    body.set("username", username)
    body.set("password", password)
    const res = await fetch("/api/user/login",{
        method:"POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        body,
        credentials:"include"
    } )
    if (!res.ok) throw new Error(`Login failed because of ${res.status}`)
    return res.json() 
}

async function refreshRequest():Promise<AccessTokenResponse>{
    const res = await fetch ("/api/user/refresh", {
        method:"POST",
        credentials :"include"
    })
}