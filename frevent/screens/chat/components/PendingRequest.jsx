import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import PenginRequestBox from './PenginRequestBox'
import { SwipeListView } from 'react-native-swipe-list-view';

const PendingRequest = ({ route, navigation }) => {
    const { pending } = route.params
    const [listData, setListData] = useState(
        Array(20)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    );

    useEffect(() => {
        const emptyArray = []
        pending.map((item, index) =>
            emptyArray.push({ key: `${index}`, ...item }))
        console.log(Array(20).fill('').map((_, i) => ({ key: `${i}`, text: `item #${i}` })))
        setListData(emptyArray)
    }, [])

    const closeRow = (rowMap, rowKey) => {
        console.log(rowKey)
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderItem = data => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >

            <PenginRequestBox data={data.item} />
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>

            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <View>
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={(foo, bar) => console.log("on row did open", foo, !!bar)}
                disableRightSwipe
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        paddingLeft: 15,
        height: 70,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'tomato',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});
/*const { pending } = route.params
const [listData, setListData] = React.useState(pending)
const swipeListRef = React.useRef(null);

const renderItem = data => (
    <TouchableHighlight
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}
    >

        <PenginRequestBox data={data.item} />
    </TouchableHighlight>
);

const closeRoww = () => {
    swipeListRef.current.closeAllOpenRows();
    //console.log(swipeListRef.current)
};


const deleteRow = (rowMap, rowKey) => {
    const newData = [...listData];
    //console.log(pending)
    const prevIndex = listData.findIndex(item => item.ID === rowKey.item.ID);
    //console.log(prevIndex)
    newData.splice(prevIndex, 1);
    closeRoww()
    //setListData(newData);
};


const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>

        <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => deleteRow(rowMap, data)}
        >
            <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
    </View>
);
return (
    <View>
        <SwipeListView
            ref={swipeListRef}
            data={listData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={0}
            rightOpenValue={-75}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={(foo, bar) => console.log("on row did open", foo, !!bar)}
            disableRightSwipe
        />
    </View>
)
}


const styles = StyleSheet.create({
container: {
    backgroundColor: 'white',
    flex: 1,
},
backTextWhite: {
    color: '#FFF',
},
rowFront: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    height: 70,
},
rowBack: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
},
backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
},
backRightBtnLeft: {
    backgroundColor: 'tomato',
    right: 75,
},
backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
},
});
/*
{pending.map((item, index) => {
return (
    <PenginRequestBox data={item} />
)
})}
*/
export default PendingRequest