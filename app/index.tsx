import { parse } from "@babel/core";
import React,{ useState, useEffect } from "react";
import { ScrollView,Image,View,Text,TextInput,TouchableOpacity,StatusBar,StyleSheet } from "react-native";

const App = () => { 

    const [ dayValue, setDayValue ] = useState('00');
    const [ hourValue, setHourValue ] = useState('00');
    const [ minuteValue, setMinuteValue ] = useState('00');
    const [ secondValue, setSecondValue ] = useState('00');

    const [ isEditingDay, setIsEditingDay ] = useState(false);
    const [ isEditingTime, setIsEditingTime ] = useState({ hours : false, minutes : false, seconds : false});
    const [ isCounting, setIsCounting ] = useState(false);
    const [ isResetting, setIsResetting ] = useState(false);

    useEffect( () => {
        let interval : NodeJS.Timeout | null = null;
        if( isCounting ){
            interval = setInterval( () => {
                if( parseInt(secondValue, 10) > 0 ){
                    setSecondValue( (prev) => (parseInt(prev, 10) - 1).toString().padStart(2, '0') );
                } else if (parseInt(minuteValue, 10) > 0 ){
                    setMinuteValue( (prev) => (parseInt(prev, 10) - 1).toString().padStart(2, '0') );
                    setSecondValue('59');
                }
                else if ( parseInt(hourValue, 10) > 0 ){
                    setHourValue( (prev) => (parseInt(prev, 10) - 1).toString().padStart(2, '0') );
                    setMinuteValue('59');
                    setSecondValue('59');
                }
                else if ( parseInt(dayValue, 10) > 0 ){
                    setDayValue( (prev) => (parseInt(prev, 10) - 1).toString().padStart(2, '0'));
                    setHourValue('23');
                    setMinuteValue('59');
                    setSecondValue('59');
                }
                else {
                    clearInterval( interval! );
                    setIsCounting(false);
                }
            },1000);
        }else if (!isCounting && interval !== null ){
            clearInterval( interval );
        }
        return () => clearInterval(interval!);
    },[ isCounting, secondValue, minuteValue, hourValue, dayValue ]);

    const handleDayClick = () => {
        setIsEditingDay(true);
    };

    const handleTimeClick = (field : string ) => {
        setIsEditingTime((prev) => ({ ...prev, [field]: true }));
    };

    const handleDayBlur = () => {
        setIsEditingDay(false);
    };

    const handleTimeBlur = (field : string ) => {
        setIsEditingTime((prev) => ({ ...prev, [field]: false }));
    };

    const handleReset = () => {
        setDayValue( '00' );
        setHourValue( '00' );
        setMinuteValue( '00' );
        setSecondValue( '00' );
        setIsCounting(false);
        setIsResetting(true);
    };

    const handleStart = () => {
        setIsCounting(true);
        setIsResetting(false);
    };
    const handleDayChange = (value : string ) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 31) {
            setDayValue(numValue.toString().padStart(2,'0'));
        } else if (value === "") {
            setDayValue('00');
        }
    };

    const handleTimeChange = (value : string ,field : string ,max : number ) => {
        const numValue = parseInt( value,10 );
        if( !isNaN(numValue) && numValue >=0 && numValue <= max ){
            if( field == 'hours' ) setHourValue( numValue.toString().padStart(2,'0'));
            if( field == 'minutes' ) setMinuteValue( numValue.toString().padStart(2,'0'));
            if( field == 'seconds' ) setSecondValue( numValue.toString().padStart(2,'0'));
        }
        else { 
            if( field == 'hours' ) setHourValue('00');
            if( field == 'minutes' ) setMinuteValue('00');
            if( field == 'seconds' ) setSecondValue('00');
        }   
    };


    return (
        <ScrollView contentContainerStyle = {styles.container}
            keyboardShouldPersistTaps = "handled"
        >
            <StatusBar
                hidden = {false}
                barStyle = 'dark-content'  
                backgroundColor = '#ffe5ec'
            />
            <Image 
                source = { 
                    require ('/home/ashish/projects/react-native/countdownApp/assets/images/c.png')
                }
                style = {styles.title}
            />
            <Image
                source = {
                    require ('/home/ashish/projects/react-native/countdownApp/assets/images/c5.png')
                } 
                style = {styles.clock}
            />
            {isEditingDay ? (
                <TextInput 
                    style={styles.inputDate}
                    value={dayValue}
                    onChangeText={handleDayChange}
                    keyboardType="numeric"
                    autoFocus
                    onBlur={handleDayBlur} 
                />
            ) : (
                <TouchableOpacity onPress={handleDayClick}>
                    <Text style={styles.dayText}>{dayValue}</Text>
                </TouchableOpacity>
            )}
            <View style = {styles.timeContainer}>
                {isEditingTime.hours ? (
                    <TextInput 
                        style = {styles.timeInput}
                        value = {hourValue}
                        onChangeText = { (value) => handleTimeChange(value, 'hours', 23)}
                        keyboardType = "numeric"
                        autoFocus
                        onBlur = { () => handleTimeBlur('hours')} 
                    />
                ) : (
                    <TouchableOpacity onPress = { () => handleTimeClick('hours')}>
                        <Text style = {styles.time}>{hourValue}</Text>
                    </TouchableOpacity>
                )}
                <Text style = {styles.colon}>:</Text>
                {isEditingTime.minutes ? (
                    <TextInput 
                        style = {styles.timeInput}
                        value = {minuteValue}
                        onChangeText = { (value) => handleTimeChange(value, 'minutes', 59)}
                        keyboardType = "numeric"
                        autoFocus
                        onBlur = { () => handleTimeBlur('minutes')} 
                    />
                ) : (
                    <TouchableOpacity onPress = { () => handleTimeClick('minutes')}>
                        <Text style = {styles.time}>{minuteValue}</Text>
                    </TouchableOpacity>
                )}
                <Text style = {styles.colon}>:</Text>
                {isEditingTime.seconds ? (
                    <TextInput 
                        style = {styles.timeInput}
                        value = {secondValue}
                        onChangeText = { (value) => handleTimeChange(value, 'seconds', 59)}
                        keyboardType = "numeric"
                        autoFocus
                        onBlur = { () => handleTimeBlur('seconds')} 
                    />
                ) : (
                    <TouchableOpacity onPress = { () => handleTimeClick('seconds')}>
                        <Text style = {styles.time}>{secondValue}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* 00
            00:00:00 */}
            {isResetting ? (
                <TouchableOpacity style = {styles.button} onPress = {handleStart}>
                    <Text style ={styles.buttonText}>START</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style = {styles.button} onPress = {handleReset}>
                    <Text style = {styles.buttonText}>RESET</Text>
                </TouchableOpacity>
            )}
            

            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container : {
        flexGrow : 1,
        alignItems : 'center',
        backgroundColor : '#ffe5ec',
        paddingBottom : 20,
    },
    inputDate: {
        padding: 65,
        fontSize: 100,
        color: '#fb6f92',
        fontWeight: 'bold',
    },
    title : {
        width : 300,
        height : 350,
        tintColor : '#fb6f92',
        marginBottom : 50,
        resizeMode : 'contain',
        marginTop : -70,
    },
    clock : { 
        width : 200,
        height : 300,
        //tintColor : '#fb6f92',
        resizeMode : 'contain',
        marginTop : -120,
    },
    dayText : {
        fontWeight : 'bold',
        fontSize : 100,
        color : '#fb6f92',
        letterSpacing : 4,
        marginBottom : 10,
    },
    timeContainer : {
        width : '25%',
        flexDirection : 'row',
        alignItems : 'center',
        marginLeft : -120,
    },
    timeInput : {
        width : '60%',
        fontSize : 50,
        color : 'black',
        letterSpacing : 5,
        fontWeight : 'bold',
    },
    // timeMinute : {
    //     width : ''
    // },
    colon : {
        fontSize : 50,
        color : 'black',
        marginHorizontal : 10,
        marginBottom : 35,
    },
    time : {
        fontSize : 50,
        color : 'black',
        marginBottom : 30,
        letterSpacing : 5,
        fontWeight : 'bold',
    
    },
    button : {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: '#fb6f92',
        marginBottom : 15,
    },
    buttonText : {
        color : 'black',
        fontSize : 25,
        fontWeight : 'bold',
        letterSpacing : 0.5,
    },
});

export default App;