import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextArea, TouchableOpacity, Image, BackHandler, ImageBackground } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Header from '../components/header'; // Import komponen Header
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import numberFormater from "../components/numberFormatter.js";
import InboundCallinTable from "../components/inboundCallinTable.js";
import { API_CONNECTION } from '@env';

const OrderDetailScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [selectedOrderInduk, setSelectedOrderInduk] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getPaymentMethod();
                await getDataDso();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const goToConfirm = () => {
        navigation.navigate('Confirm', { item });
    };

    const getDataDso = async () => {
        const getSetting = await AsyncStorage.getItem('Setting');
        const parseSetting = JSON.parse(getSetting);
        const token = await AsyncStorage.getItem('token');
        const parsedToken = JSON.parse(token);

        try {
            const response = await axios({
                method: "get",
                url: parseSetting.Connection + `/orders/detail/${item.dsoOrderId}`,
                // body: {},
                headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
            });


            if (response.status === 200) {
                console.log(response.data.data.data[0].orderDetails);
                // setDataOrder(response.data.data.data[0].orderDetails);
                const tempmenu = response.data.data.data[0].orderDetails;
                try {
                    const newDataInfoStoreStatus = [];
                    tempmenu.forEach((item) => {
                        const datamodifiers = [];
                        item.modifiers.forEach((items) => {
                            datamodifiers.push({
                                id: items.modifier.id,
                                modifier: items.modifier.modifier,
                            });
                        });
                        const newItem = {
                            id: item.menu.id,
                            name: item.menu.menuName,
                            qty: item.qty,
                            pricebeforetax: item.price,
                            discount: item.discount,
                            totalpricebeforetax: item.subTotal,
                            modifier: datamodifiers,
                        };

                        newDataInfoStoreStatus.push(newItem);
                    });

                    const datamenustore = [];
                    datamenustore.push({
                        id: response.data.data.data[0].store.id,
                        store: response.data.data.data[0].store.storeName,
                        menuItems: newDataInfoStoreStatus
                    });

                    setSelectedOrderInduk(datamenustore);

                } catch (error) {
                    console.error('Error occurred:', error);
                }
            }

        } catch (error) {
            console.error('Gagal ambil data:', error);
        }
    };

    const getPaymentMethod = async () => {
        const getSetting = await AsyncStorage.getItem('Setting');
        const parseSetting = JSON.parse(getSetting);
        const token = await AsyncStorage.getItem('token');
        const parsedToken = JSON.parse(token);

        try {
            const response = await axios({
                method: "get",
                url: parseSetting.Connection + '/orders/payment-method',
                // body: {},
                headers: { "Content-Type": "application/json", 'Authorization': `${parsedToken.type} ${parsedToken.token}` },
            });


            if (response.status === 200) {
                console.log('responpayment', response.data.data.data);
                // setDataOrder(response.data.data.data[0].orderDetails);
                const tempmenu = response.data.data.data;
                const paymentfilter = tempmenu.find(datapay => datapay.id === item.orders.paymentMethodId);
                setPaymentMethod(paymentfilter);
            }

        } catch (error) {
            console.error('Gagal ambil data payment:', error);
        }
    };

    const columnsMenuInduk = [
        {
            title: 'Menu',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, _index) => {
                const datamodifiers = record.modifier;
                return (
                    <View>
                        <Text style={{ cursor: "pointer", color: 'black' }}>{text}</Text>
                        {datamodifiers.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                disabled
                                // onPress={() => handleDeleteModifier(record, item.id)}
                            >
                                <Text style={{ cursor: "pointer", color: 'blue' }}>{item.modifier}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            }
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            render: (text) => <Text style={{ textAlign: 'right' }}>{numberFormater(text)}</Text>
        },
        {
            title: 'Price Before Tax',
            dataIndex: 'pricebeforetax',
            key: 'pricebeforetax',
            render: (text) => <Text style={{ textAlign: 'right' }}>{numberFormater(text)}</Text>
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (text) => <Text style={{ textAlign: 'right' }}>{numberFormater(text)}</Text>
        },
        {
            title: 'Total Price Before Tax',
            dataIndex: 'totalpricebeforetax',
            key: 'totalpricebeforetax',
            render: (text) => <Text style={{ textAlign: 'right' }}>{numberFormater(text)}</Text>
        }
    ];

    const infoStoreInduk = {
        title: "",
        data: selectedOrderInduk
            .map(order => order.menuItems)
            .flat(),
        columns: columnsMenuInduk
    };

    const objectHomeInduk = [
        infoStoreInduk
    ];


  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.layerTitle}></Text>
        <View style={styles.layerContainer}>
                  <ScrollView>
                    <View style={styles.tabel}>
                          <View style={{ alignItems: 'center', marginBottom: 16 }}>
                              <Text style={styles.layerTitle}>Order Summary</Text>
                          </View>

                          {objectHomeInduk.map((items) => (
                              <InboundCallinTable
                                  key={items.title}
                                  title={items.title}
                                  columns={items.columns}
                                  dataSource={items.data}
                              />
                          ))}

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10 }}>
                              {/* <View style={{ flex: 1, margin: 10 }}>
                                  <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>NOTES :</Text>
                                  <TextInput
                                      value={data.remark}
                                      editable={false}
                                      multiline={true}
                                      style={{ height: 70, backgroundColor: '#fff', color: '#000', borderColor: 'gray', borderWidth: 1, padding: 5 }}
                                  />
                              </View> */}
                              <View style={{ flex: 1, margin: 6 }}>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>SUB TOTAL</Text>
                                      <Text>{numberFormater(item.orders.subTotal)}</Text>
                                  </View>
                                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>SUB TOTAL DISCOUNT</Text>
                                      <Text>{numberFormater(item.orders.discount)}</Text>
                                  </View>
                                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>DELIVERY CHARGES</Text>
                                      <Text>{numberFormater(item.orders.deliveryFee)}</Text>
                                  </View>
                                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>TAX 11%</Text>
                                      <Text>{numberFormater(item.orders.tax)}</Text>
                                  </View>
                                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>GRAND TOTAL</Text>
                                      <Text>{numberFormater(item.orders.grandTotal)}</Text>
                                  </View>
                                  <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text>PAYMENT ({paymentMethod ? paymentMethod.name : ''})</Text>
                                      <Text>{numberFormater(item.orders.paymentValue)}</Text>
                                  </View>
                                  {paymentMethod.id === 1 && (
                                    <>
                                        <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 2 }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Text>PREPARED CHANGE</Text>
                                          <Text>{numberFormater(item.orders.preparedChange)}</Text>
                                      </View>
                                    </>
                                  )}
                                  
                              </View>
                          </View>

                    </View>
                    <TouchableOpacity style={styles.button} onPress={goToConfirm}><Text style={styles.buttonText}>NEXT</Text></TouchableOpacity>
                  </ScrollView>
                  
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
    },
    layerTitle: {
        fontSize: 18,
        paddingLeft: 14,
        paddingTop: 12,
        paddingBottom: 6,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    layerContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        flex: 1,
    },
    boxContainer: {
        width: '100%',
        marginVertical: 4,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    bodyContainer: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor:'rgba(240,240,240,1)'
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginBottom: 6,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        justifyContent:'center',
    },
    inputArea: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white'

    },
    button: {
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        height: 40,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 14,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(240,240,240,1)',
    },
    column: {
        flex: 1,
    },
    column2: {
        flex: 2,
    },
    column3: {
        flex: 0.25,
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    namaLayananText: {
        flex: 1,
    },
    textColumn: {
        fontSize: 14,
        color: 'black',
        textAlign:'center'
    },
    textColumn3: {
        fontSize: 14,
        color: 'black',
        textAlign: 'left'
    },
    textColumn2: {
        fontSize: 14,
        color: 'black',
        textAlign: 'right'
    },
    tabel: {
        flex: 1,
        padding: 16,
        borderWidth: 1,
        borderColor: 'black',
    },
    baris: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: 'black',
    },
    barisIsi: {
        flexDirection: 'row',
        // borderBottomWidth: 1,
        // borderColor: 'black',
    },
    barisTotal: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: 'black',
    },
    sel: {
        flex: 1,
        padding: 8,
    },
    teksHeader: {
        fontWeight: 'bold',
        color: 'black',
    },
    teksIsi: {
        // fontWeight: 'bold',
        color: 'black',
    },
    teksIsi2: {
        // fontWeight: 'bold',
        color: 'black',
    },
});

export default OrderDetailScreen;
