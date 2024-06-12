import React from "react";
import { View, Text } from "react-native";
import numberFormater from "./numberFormatter.js";

const InboundCallinTable = ({
    columns,
    dataSource,
}) => {
    const subTotalPriceBeforeTax = () => {
        let subtotal = 0;
        dataSource.forEach((item) => {
            subtotal = subtotal + item.totalpricebeforetax;
        });
        return subtotal;
    };

    const subTotalDiskon = () => {
        let subdiskon = 0;
        dataSource.forEach((item) => {
            subdiskon = subdiskon + item.discount;
        });
        return subdiskon;
    };

    const subPriceBeforeTax = () => {
        let subpricebeforetax = 0;
        dataSource.forEach((item) => {
            subpricebeforetax = subpricebeforetax + item.pricebeforetax;
        });
        return subpricebeforetax;
    };

    const subQty = () => {
        let subqty = 0;
        dataSource.forEach((item) => {
            subqty = subqty + item.qty;
        });
        return subqty;
    };
    console.log(columns);
    return (
        <View style={{ backgroundColor: '#fff', padding: 8, marginBottom: 8, borderRadius: 6 }}>
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, }}>
                {columns.map((item, index) => (
                    <Text key={index} style={{ flex: index === 0 ? 0 : 1, width: index === 0 ? 80 : 'auto', textAlign: index === 0 ? 'left' : 'center' }}>{item.title}</Text>
                ))}
            </View>

            {dataSource.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text style={{width: 80}}>{item.name}</Text>
                    <Text>{numberFormater(item.qty)}</Text>
                    <Text>{numberFormater(item.pricebeforetax)}</Text>
                    <Text>{numberFormater(item.discount)}</Text>
                    <Text>{numberFormater(item.totalpricebeforetax)}</Text>
                </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingVertical: 5 }}>
                <Text style={{ width: 80 }}>Total</Text>
                <Text>{numberFormater(subQty())}</Text>
                <Text>{numberFormater(subPriceBeforeTax())}</Text>
                <Text>{numberFormater(subTotalDiskon())}</Text>
                <Text>{numberFormater(subTotalPriceBeforeTax())}</Text>
            </View>
        </View>
    );
};

export default InboundCallinTable;
