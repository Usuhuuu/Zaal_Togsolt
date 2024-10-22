import { View, StyleSheet, Text } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ListingGeo } from '@/interfaces/listingGeo';
import { useRouter } from 'expo-router';
import MapView from 'react-native-map-clustering';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ListingsMapProps {
  listings: {
    features: ListingGeo[];
  };
}

const ListingsMap = memo(({ listings }: ListingsMapProps) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const router = useRouter();

  const onMarkerSelected = (item: ListingGeo) => {
    router.push(`/listing/${item.properties.id}`);
  };
  const INITIALREGION ={
    latitude: userLocation?.latitude || 52.52, // Default to Berlin if userLocation not available
    longitude: userLocation?.longitude || 13.405,
    latitudeDelta: 0.1, // Adjust for zoom level
    longitudeDelta: 0.1,
  }

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location.coords);
      } else {
        setHasLocationPermission(false);
      }
    };

    requestLocationPermission();
  }, []);

  const renderCluster = (cluster: any)=>{
    const {id , geometry , onPress , properties} = cluster;
    const points = properties.point_count;

    return (
      <Marker key = {`cluster-${id}`} 
      onPress={onPress}
      coordinate={{
        longitude : geometry.coordinates [0],
        latitude : geometry.coordinates[1],
      }}>

      <View style={styles.marker}>
        <Text style = {{
          color : '#fff',
          textAlign : 'center'
        }}>{points}</Text>
      </View>

      </Marker>
    )

  }

  return (
    <View style={styles.container}>
      <MapView
        animationEnabled={false}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={true}
        initialRegion={
          INITIALREGION
        }
        clusterColor={Colors.primary}
        renderCluster={renderCluster}
        >
        {listings.features.map((item: ListingGeo) => (
          <Marker
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}
            coordinate={{
              latitude: parseFloat(item.properties.latitude),
              longitude: parseFloat(item.properties.longitude),
            }}
            title={item.properties.name}
            description={item.properties.summary ?? undefined}
          />
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  }
});

export default ListingsMap;
