/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import Axios from 'axios';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import axios from 'axios'

const App = () => {
  const [phone, setPhone] = useState("")
  const [mode, setMode] = useState("request")
  const [code, setCode] = useState("")
  const [status, setStatus] = useState(0)
  const [requestid, setRequestId] = useState("")
  const [responseVonage, setResponseVonage] = useState("")

  const api_key = "YOUR-APP-KEY"
  const api_secret = "YOUR-APP-SECRET"  
  const phoneCode = '62' // Your international code number
  
  const onRequestOtp = async () => {
    if (phone == null || phone == "") {
      Alert.alert("Alert", "Phone number must not be empty")
      return false
    } else {
      setMode("verify")
      setCode("")
      setResponseVonage("")
      const number = phoneCode + phone
      const urlRequest = `https://api.nexmo.com/verify/json?api_key=${api_key}&api_secret=${api_secret}&number=${number}&brand=Infokes&next_event_wait=300`
      console.log(urlRequest)
      await axios.get(urlRequest).then(({data}) => {
        const requestid = data.request_id
        const status = data.status 

        setRequestId(requestid)
        setStatus(status)

      }).catch((error) => {
        console.log(error)
      })
    }
  }

  const onConfirmCode = async () => {
    if (code == null || code == "") {
      Alert.alert("Perhatian", "6 Digit Code must not be empty")
      return false
    } else {
      setMode("verify")
      const urlConfirm = `https://api.nexmo.com/verify/check/json?api_key=${api_key}&api_secret=${api_secret}&request_id=${requestid}&code=${code}`
      
      await axios.get(urlConfirm).then(({data}) => {
        setResponseVonage(JSON.stringify(data))
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  return (
    <View style={styles.section}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
          React Native x SMS OTP x Vonage
        </Text>
      </View>
      {mode == 'request' ? 
      <View>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          mode="flat"
          label="Code"
          editable={false}
          value={phoneCode}
        />
        <TextInput
          mode="flat"
          label="Phone number"
          value={phone}
          style={{ flex: 1 }}
          keyboardType="number-pad"
          onChangeText={text => setPhone(text)}
        />
      </View>
      <Button style={{ marginTop: 10 }} icon="cellphone" mode="contained" onPress={() => onRequestOtp()}>
        Send OTP
      </Button>
      </View>
      : 
      <View style={{  }}>
        <TextInput
          mode="flat"
          label="US Digit Code"
          value={code}
          keyboardType="number-pad"
          onChangeText={text => setCode(text)}
        />
        <Button style={{ marginTop: 10 }} icon="send" mode="contained" onPress={() => onConfirmCode()}>
          Confirm
        </Button>
        <Button style={{ marginTop: 10 }} icon="arrow-left" mode="contained" onPress={() => {
          setMode("request")
          setPhone("")
        }}>
          Back
        </Button>

        <View style={{ marginTop: 10 }}>
          <Text>{responseVonage}</Text>
        </View>
      </View> }
    </View>
  )
}

const styles = StyleSheet.create({
  section : {
    padding: 15,
    justifyContent: 'center', 
    alignContent: 'center', 
    height: '100%'
  }
})

export default App;
