import React from "react";

import Spinner from "@/presentation/components/spinner/spinner";
import Header from "@/presentation/components/login-header/login-header";
import Footer from "@/presentation/components/footer/footer";
import Input from "@/presentation/components/input/input";

import Styles from "./login-styles.scss";

const Login: React.FC = () => {
    return (
        <div className={Styles.login}>
            <Header />
            <form className={Styles.form}>
                <h2>Login</h2>
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                />
                <button className={Styles.submit} type="submit">
                    Sign In
                </button>
                <span className={Styles.link}>Register</span>
                <div className={Styles.errorWrap}>
                    <Spinner className={Styles.spinner} />
                    <span className={Styles.error}>Error</span>
                </div>
            </form>
            <Footer />
        </div>
    );
};

export default Login;
