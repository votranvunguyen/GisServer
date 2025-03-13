import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import serviceData from '../../../public/serviceCommon.json';

const ValidUser = ({onLoaded}) => {
    const [error, setError] = useState("");
    const [validationData, setValidationData] = useState(null);
    const objectAuthen = serviceData.authentication;
    const apiValid = objectAuthen.APIValid;
    const productid = objectAuthen.Product_id;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("vbd_token");
        if (!token) {
            // Nếu không có token thì chuyển hướng về trang "/login"
            alert('You need to login !');
            navigate("/login");
        } else {
            // Hàm gọi API validate token
            const validateToken = async () => {
                const requestBody = {
                    productid: productid,
                    token: token,
                };

                try {
                    const response = await fetch(apiValid, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestBody),
                    });
                    const result = await response.json();

                    if (result.code === 200) {
                        setValidationData(result.data);
                        setError("");
                        onLoaded();
                    } else {
                        setError(result.message || "Có lỗi khi validate token.");
                        navigate("/login");
                    }
                } catch (err) {
                    setError("Lỗi khi gọi API validate token: " + err.message);
                    navigate("/login");
                }
            };

            validateToken();
        }
    }, [apiValid, navigate, productid]);

    return (
        <>
        </>
    );
};

export default ValidUser;
