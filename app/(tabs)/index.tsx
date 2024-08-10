import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack } from 'expo-router'
import Listing from '@/components/Listing'
import ExploreHeader from '@/components/ExploreHeader'
const Page= () => {
  const [category, setCategory] = useState('Sags');
  const onDataChanged = (category : string)=>{
    console.log(`CHANGED_`,category);
    setCategory(category);
  };
  //login heseg bolon busad heseg 
  return (
    <View style = {{flex:1 , marginTop: 200}}>
      <Stack.Screen
      options={{
        header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
      }}
      />
      <Listing listings={[]} category={category}/>
    </View>
  )
}

export default Page