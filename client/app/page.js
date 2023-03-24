"use client"

import styles from './page.module.css';
import Sectionone from './sectionone';
import Sectiontwo from './sectiontwo';
import Sectionthree from './sectionthree';
import Sectionfour from './sectionfour';
import Sectionfive from './sectionfive';
import Sectionsix from './sectionssix';
import Sectionseven from './sectionseven';
import Sectioneight from './sectioneight';
import Sectionnine from './sectionnine';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../redux/reducers/profileSlice'
import jwt_decode from "jwt-decode";



export default function Home() {
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);
  const sectionFiveRef = useRef(null);
  const sectionSevenRef = useRef(null);
  const tokendetails = useSelector(state => state.profile);
  
  // middleware to check if token is expired and refresh it
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:10000/api/v1/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })).json();
        console.log(result.accessToken)
        const { email, exp, role } = jwt_decode(result.accessToken)
        dispatch(setProfile(result.accessToken))
        dispatch(setEmailAdd(email))
        dispatch(setUserRole(role))
        const isExpired = (exp * 1000) < new Date().getTime()
        dispatch(setTokenExp(isExpired))
    }
    checkRefreshToken();
  }, []);


  return (
    <div className={styles.main}>
      <div className={styles.sectionone}>
        <Sectionone sectiontworef={sectionTwoRef}/>
      </div>
      <div ref={sectionTwoRef}>
        <Sectiontwo sectionthreeref={sectionThreeRef}/>
      </div>
      <div ref={sectionThreeRef}>
        <Sectionthree />
      </div>
      <div>
        <Sectionfour sectionFiveref = {sectionFiveRef}/>
      </div>
      <div ref={sectionFiveRef}>
        <Sectionfive />
      </div>
      <div>
        <Sectionsix sectionSevenref = {sectionSevenRef}/>
      </div>
      <div ref={sectionSevenRef}>
        <Sectionseven />
      </div>
      <div>
        <Sectioneight />
      </div>
      <div>
        <Sectionnine />
        </div>
    </div>
  );
}
