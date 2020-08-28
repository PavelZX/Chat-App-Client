import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const UserAvatar = ({ avatar, handleClick, color = '#0af' }) => {
	return (
		<View>
			<TouchableOpacity onPress={handleClick}>
				{avatar ? (
					<Image source={{ uri: avatar }} style={styles.avatarStyle} />
				) : (
					<Entypo name="user" size={50} color="#000" />
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
});

export default UserAvatar;
