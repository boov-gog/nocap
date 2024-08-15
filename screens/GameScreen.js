import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Logo } from '../components'
import { Images } from '../config'

const GameScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.logoContainer}>
        <Logo uri={Images.logo} />
      </View>
      <View style={styles.mainPart}>

      </View>
    </SafeAreaView>
  )
}

export default GameScreen

const styles = StyleSheet.create({

})