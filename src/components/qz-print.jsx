import React, { useState, useEffect } from 'react';
import qz from 'qz-tray';
import { Printer, Text, Row, Line, Cut, render } from 'react-thermal-printer';


import { db } from "../fb";
import { collection, onSnapshot, query, orderBy, or, updateDoc, where, serverTimestamp, doc } from "firebase/firestore";

import jsrsasign from 'jsrsasign'; // npm install jsrsasign


const configureQZSecurity = () => {
    // 1. Set the Public Certificate
    const publicCert = `-----BEGIN CERTIFICATE-----
MIIECzCCAvOgAwIBAgIGAZtsGLDGMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG
EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS
UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx
HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg
RGVtbyBDZXJ0MB4XDTI1MTIyODIxNTE1NloXDTQ1MTIyODIxNTE1NlowgaIxCzAJ
BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD
VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs
IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog
VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCV
zGJjhvrgIOE4g2Iamxivt4udAWAiEtdmK7ABe2t1xz84yvK9L+xzf0BR4rR86Hem
oYkxBgQjYGLdvsiR05TtLdSbGX5KkzjR2LTUrtUIjd6f8sNPb0WzuH03i+YHYwTs
8jZlyQme4PgwiZge+YhKWsFT/h8g5N3jbiSPrJsdRVoePKxiFgGbEMSxqaNT7zrj
YPWAaclA8pHgwTIeN8tnbGSKNCsmJgrYRqemWU1LvMnVwCII06qvbXzeDX+daG3B
Al7/9uvjM1LGEm5zJjvzqQHvumQNtIhQjA7RF/C2mazuWtRHG5+8RQR7tMXeSIqQ
ipX/Z6vPYfpJ4rtddT45AgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBQ0zrzZ/ws2w5QWDpbzwooTI+QhkDANBgkq
hkiG9w0BAQsFAAOCAQEAdY7Cr9BbgHz24cMMiTsS9nkMPPp9qv42UDstqt8Zcvw7
fij21nrLnLYxcz3seVrTMpbPcf8qL3Kut0PSDYBJhEX6eXDrhH3a5IISq+2/Ur4W
jhQdoIUrbyh8DbO2ZNgzIubXMGZL4bVh6YMTNQSEeHw3W9zSlkzygEOwJMxGi44K
ixUogTef3JtrD7SyPP68LC/MWxTpv+IpzDwe+nxBFhQk2ADs/MLb8Vc7nWT5ee7W
5XdH11sRNkN8TsMGXTWoSSUynQ0pLp2PVMjW0IPJeWedH1kLijsqqAt0pVe9dKZD
Xwrfp1RXsWShpVslJ2RvCBEQCvrmv6Zt/C7sUwgJ7g==
-----END CERTIFICATE-----`;

    qz.security.setCertificatePromise((resolve) => {
        console.log("Providing public certificate for QZ Tray.");
        resolve(publicCert)
    });

    // 2. Set the Signature Promise
    // This signs every privileged request (like printing)
    qz.security.setSignaturePromise((toSign) => {
        return (resolve, reject) => {
            console.log("Providing public signature for QZ Tray.");
            try {
                const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVzGJjhvrgIOE4
g2Iamxivt4udAWAiEtdmK7ABe2t1xz84yvK9L+xzf0BR4rR86HemoYkxBgQjYGLd
vsiR05TtLdSbGX5KkzjR2LTUrtUIjd6f8sNPb0WzuH03i+YHYwTs8jZlyQme4Pgw
iZge+YhKWsFT/h8g5N3jbiSPrJsdRVoePKxiFgGbEMSxqaNT7zrjYPWAaclA8pHg
wTIeN8tnbGSKNCsmJgrYRqemWU1LvMnVwCII06qvbXzeDX+daG3BAl7/9uvjM1LG
Em5zJjvzqQHvumQNtIhQjA7RF/C2mazuWtRHG5+8RQR7tMXeSIqQipX/Z6vPYfpJ
4rtddT45AgMBAAECggEAAfPpG34K11sVh+hb0TmobTozE7O1cO30vScnVBgk3sTm
F/VOzyWqZHaG0IVoSuCqTFOp3jVXlGpgRyV7yYD7J69t0PaiuFVDQASk5qCQhRIN
3GfgroFVqBiRW6GfAvgdJJ0Vtz6Mb7CMhCYZJWMRNojStXiSQqD2os1VshnjzO1P
2PBzcPFrNzfFxEC4CsmpXtvxcvn7djRNYawYDrX9No72bVFZRdQGLPpX8v9iyZem
e6tVUOTJp7TMV2nM1OK9kAsrDqiqI2FWRhdy8nlADkuUgcpcRaw9Z77yzjYZC5jj
9o885vP1CInH/QU/hFta2p3gCI9dlKl3zX+WvE7+uQKBgQDS2FP8B0trU9F9ak6s
zC2d3f9nkTcX5jlirwnd4tMNMALoH4s6AlLk0XjpFEbBgCGjoWCKDy5CoHkaKlnT
T12JRN8xxQUcI1kGvd38Ii86NqCVtrID1xKU+NbSGRYqbsOCwDZN3SkrEY+2tK5X
Zb9I3iDBufXkX9M+A3Xp2br9DQKBgQC14SV9XicvaVrp4FQuDrGM982SM2dcujcq
5Xq5T37JpNkv8FBel3hWxAYzwYt0V72aBkBfL/geJHDLk+ObKVaHdFMjGBh0pszg
jzkgcwyw1AyTFNrPl8L1jAIo5vRAxPc/6WJ7/sd17gzO5b8u9jiCiAwhDiKHI0Js
T7D/H31y3QKBgBQcVC5m17e9/+5RdH2g3/z9zr2nKTUbXX/fKDbEytKoMK7JS3NW
A2gV3s2EhJcyTIMaAmZIumXafpKTVYwFNuu/6PYLT8h2SqiM9Z51+EE6Mqj1Cxe4
rOoOrhbOE8IqXHWdNdDJdoLIIwgPRc3KQ6uEnGU+Aoks5q40kEuk2+QFAoGBAIfg
oUJs0beA7ROmrR0PiyO2iZS85G6JC+f3Mt04f48jocJHtbNFU/j2T2/hG08asaJd
I0A5tRLHxKDCZpsnoeZmSCoCuVqEtrDZLyOH8CY29QH45ZOLXHJXW9G04St2OwU7
VYEvEVKQOm9jgpYSCpuyCeW0CqWM+PWz/5ZJr03dAoGATRrp4lApOSmYQVoqQCsi
2yXQ6zEgj1av7fCXODnyVuvVYoFqtTag0TOw0QiFFdsFDv9bk7xk0bAKchHMkGSq
Qa4uWJpJ7ADdcO8t6muHVCUfXU+VS9mtM/v04VQv8Vd2sFSUUdAuE5QIMxjtK28T
8r1E3Ho0RYMMRq9ISZgDgOk=
-----END PRIVATE KEY-----`;
                // // Create a signature using SHA512 (Recommended for 2025)
                const sig = new jsrsasign.KJUR.crypto.Signature({ alg: "SHA1withRSA" });
                sig.init(privateKey);
                sig.updateString(toSign);
                const hex = sig.sign();

                // Replace the failing resolve line with this:
                const base64Signature = btoa(hex.match(/\w{2}/g).map(a =>
                    String.fromCharCode(parseInt(a, 16))
                ).join(""));

                resolve(base64Signature);



                // // Return as Base64
                // resolve(window.btoa(String.fromCharCode(...Buffer.from(hex, 'hex'))));
            } catch (err) {
                console.error("Signing failed:", err);
                reject(err);
            }
        };
    });
};


let printers = [];
let printerName = "PDFwriter";

const EpsonPrinter = () => {

    const [status, setStatus] = useState(({ status: 'Disconnected', printers: [] }));
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        configureQZSecurity();
        // Start connection on mount
        if (!qz.websocket.isActive()) {
            qz.websocket.connect()
                .then(async () => {
                    var printers = await qz.printers.find(); // No argument returns all printers
                    setStatus({ status: 'Connected to QZ Tray', printers });
                    console.log("Available Printers:", printers);
                })
                .catch(err => setStatus({ status: 'Connected to QZ Tray', printers: [] }));
        }
        var printers = qz.printers.find().then(printers => {
            setStatus({ status: 'Connected to QZ Tray', printers });
        });
    }, []);

    useEffect(() => {
        // 1. Criamos a query (ordenando por data decrescente para ver os novos no topo)
        const q = query(collection(db, "orders"));

        // 2. Iniciamos o listener
        const unsubscribe = onSnapshot(q,
            (snapshot) => {

                snapshot.docChanges().forEach((change) => {
                    // "added" captura novos documentos ou o estado inicial da coleção
                    if (change.type === "added" && change.doc.data().status !== "printed") {
                        handlePrint(change.doc);
                    }
                });

                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
                console.log("Pedidos em tempo real:", ordersData);

            },
            (err) => {
                console.error("Erro ao assinar coleção:", err);
                setError("Erro de permissão ou conexão.");
            }
        );

        // 3. LIMPEZA (Cleanup): O React chama isso ao desmontar o componente
        // Isso é essencial para não deixar conexões abertas e gastar leituras no Firebase
        return () => unsubscribe();
    }, []); // Array vazio garante que o efeito rode apenas uma vez na montagem


    const handlePrint = async (order) => {
        try {
            // 1. Find the printer (replace with your exact Epson printer name)
            var orderData = order.data ? order.data() : order;
            console.log("v1");
            console.log("Printing order:", orderData);
            const printer = await qz.printers.find(printerName);
            const config = qz.configs.create(printer, { forceRaw: true });
            const uint8array = await render((
                <Printer type="epson" width={48}>
                    <Line />
                    <Text align="center" size={{ width: 2, height: 2 }}>SABOR IN BOX</Text>
                    <Line />
                    <Text align="left" size={{ width: 1, height: 1 }}>Cliente: Test</Text>
                    <Text align="left" size={{ width: 1, height: 1 }}>Endereço: TESTE</Text>
                    <Text align="left" size={{ width: 1, height: 1 }}>Telefone: Teste</Text>
                    <Line />
                    <Text align="center" bold={true} size={{ width: 1, height: 1 }}>ITEMS</Text>
                    <Line />
                    {orderData.cart && orderData.cart.length > 0 &&
                        orderData.cart.map((item, index) => (
                            <Row left={`${item.quantity}x ${item.name}`} right={`R$ ${(item.price * item.quantity).toFixed(2)}`} />
                        ))}
                    <Line />
                    <Row left="TOTAL" right={orderData.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} bold={true} />
                    <Cut />
                </Printer>
            ));


            const base64Data = btoa(Array.from(uint8array)
                .map(byte => String.fromCharCode(byte))
                .join(''));


            await qz.print(config, [{ type: 'raw', format: 'command', flavor: 'base64', data: base64Data }])
                .then(async () => {
                    console.log("Print job sent successfully.");
                    const orderRef = doc(db, "orders", order.id);
                    await updateDoc(orderRef, {
                        status: "printed",
                        updatedAt: serverTimestamp() // Opcional: registra quando foi atualizado
                    });
                }).catch((err) => {
                    console.error("Print job failed:", err);
                });
            alert("Print job sent!");
        } catch (err) {
            console.error(err);
            alert("Printing failed: " + err.message);
        }
    };

    return (
        <div>
            <p>Status: {status.status}
            </p>
            <select id="printerSelect" onChange={(e) => printerName = e.target.value} defaultChecked="">
                {status.printers.map((printer, index) => (
                    <option key={index} value={printer}>{printer}</option>
                ))}
            </select>
            <button onClick={handlePrint} disabled={status === 'Disconnected'}>
                Print Receipt
            </button>
            <div>
                <h2>Lista de Pedidos (Tempo Real)</h2>
                {orders.length === 0 ? (
                    <p>Nenhum pedido encontrado.</p>
                ) : (
                    <ul>
                        {orders.map(order => (
                            <li key={order.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
                                <strong>ID:</strong> {order.id} <br />
                                <strong>Cliente:</strong> {order.nome || 'N/A'} <br />
                                <strong>Total:</strong> R$ {order.total || '0.00'}<br />
                                <strong>Status:</strong> {order.status || '-'}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EpsonPrinter;
