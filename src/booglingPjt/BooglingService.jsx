import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";
import "./css/common.css";
import "./css/index.css";
import Main from "./route/Main";
import SignUp from "./route/SignUp";
import SignUpResult from "./route/SignUpResult";
import SignIn from "./route/SignIn";
import SignInResult from "./route/SignInResult";
import UserModify from "./route/UserModify";
import UserModifyResult from "./route/UserModifyResult";
import Search from "./route/Search";

import axios from "axios";
import KakaoMapMain from "./KakaoMapMain";
import Favorites from "./route/Favorites";
import AptDetail from "./route/AptDetail";

const serviceKey =
    "0TEjPSWe8Amdu9ZJNlmbFk6NN2BTXyQ%2FmbjKh0CNdzVi1HdozklmwK1bMRH%2BwqQ9v9d0Tz7p%2FSquZPjNdufLdg%3D%3D"; // 서비스키(필수)
const pageNo = 1; // 페이지 번호(옵션)
const numOfRows = 10; // 한 페이지 결과 수(옵션)

const BooglingService = () => {
    const [userDB, setUserDB] = useState(new Map()); // 사용자 데이터베이스를 관리하기 위한 상태 변수
    const signInedMember = useRef(""); // 현재 로그인한 회원을 저장하기 위한 참조 변수
    const changeLoginStatus = useRef(""); // 로그인 상태 변경 함수를 호출하기 위한 참조 변수

    const setLoginedSession = () => {
        console.log("[BooglingService] setLoginedSesstion() CALLED!!");

        changeLoginStatus.current.changeLoginMember(signInedMember); // 로그인된 회원을 변경하도록 로그인 상태 변경 함수 호출
    };

    const [item, setItem] = useState([]); //중복값이 있는 아파트명 목록

    useEffect(() => {
        console.log("[BooglingService] useEffect1!!");

        getRemoteData(); // 원격 데이터를 가져오기 위한 함수 호출
    }, []);

    async function getData(y, m, r) {
        console.log("[BooglingService] getData() CALLED!!");

        try {
            let deal_ymd = (y + m) * 1; // 년도와 월을 조합하여 거래 년월을 생성 (예: 2022년 01월 -> 202201)
            let region = `26${r}0`; // 지역 코드 생성

            let url = `http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&LAWD_CD=${region}&DEAL_YMD=${deal_ymd}`;
            const response = await axios.get(url); // API를 호출하여 데이터 가져오기
            // console.log('response ---> \n', response.data.response.body.items.item);

            let items = response.data.response.body.items.item;
            item.push(items); // 가져온 데이터를 목록에 추가
            let temp = item.slice();
            setItem(temp); // 목록 업데이트
            // setItem([...item, items])
        } catch (error) {
            console.log(error);
        } finally {
            console.log("finally");
        }
    }

    async function getRemoteData() {
        console.log("[BooglingService] getRemoteData() CALLED!!");

        let year = ["2022"];
        let month = ["01"];
        let region = [
            "11",
            "14",
            "17",
            // "20",
            // "23",
            // "26",
            // "29",
            // "32",
            // "35",
            // "38",
            // "41",
            // "44",
            // "47",
            // "50",
            // "53",
            // "71",
        ];

        try {
            year.map(function (y) {
                month.map(function (m) {
                    region.map(function (r) {
                        getData(y, m, r); // 각 조합에 대해 데이터 가져오는 함수 호출
                    });
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            console.log("finally");
        }
    }

    return (
        <>
            <BrowserRouter>
                <Header />
                <Nav ref={changeLoginStatus} signInedMember={signInedMember} />
                <Routes>
                    <Route path="/" element={<Main item={item} />}></Route>
                    <Route
                        path="/user/sign_up"
                        element={<SignUp userDB={userDB} />}
                    ></Route>
                    <Route path="/user/sign_up_result" element={<SignUpResult />}></Route>
                    <Route
                        path="/user/sign_in"
                        element={
                            <SignIn
                                userDB={userDB}
                                signInedMember={signInedMember}
                                setLoginedSession={setLoginedSession}
                            />
                        }
                    ></Route>
                    <Route path="/user/sign_in_result" element={<SignInResult />}></Route>
                    <Route
                        path="/user/modify"
                        element={
                            <UserModify userDB={userDB} signInedMember={signInedMember} />
                        }
                    ></Route>
                    <Route
                        path="/user/modify_result"
                        element={<UserModifyResult />}
                    ></Route>
                    <Route path="/search" element={<Search item={item} />}></Route>
                    <Route path="*" element={<Main />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
export default BooglingService;