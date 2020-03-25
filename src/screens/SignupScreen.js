import React, { useContext, useState, useEffect, forwardRef, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated, Easing } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Spacer from '../components/Spacer';
// import { NavigationEvents } from "react-navigation";
import { SafeAreaView } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from '../components/LoadingIndicator';

const FadeInView = props => {
	const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 2000,
		}).start();
	}, []);

	return (
		<Animated.View // Special animatable View
			style={{
				...props.style,
				opacity: fadeAnim, // Bind opacity to animated value
			}}
		>
			{props.children}
		</Animated.View>
	);
};

const BouncyInput = forwardRef(
	(
		{
			value,
			onChangeText,
			placeholder = '',
			autoFocus = false,
			autoCapitalize = 'none',
			autoCorrect = false,
			containerStyle = {},
			inputStyle = { color: 'white' },
			returnKeyType = 'next',
			selectTextOnFocus = true,
			onSubmitEditing = null,
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const [introAnim] = useState(new Animated.Value(-50));
		useEffect(() => {
			Animated.timing(introAnim, {
				toValue: 0,
				easing: Easing.bounce,
				duration: 500,
			}).start();
		}, []);

		// const [bounceAnim] = useState(new Animated.Value(0));
		const handleOnFocus = () => {
			Animated.sequence([
				Animated.timing(introAnim, {
					toValue: -10,
					duration: 130,
				}),
				Animated.timing(introAnim, {
					toValue: 0,
					duration: 130,
				}),
			]).start();
			setIsFocused(true);
		};

		const handleOnBlur = () => {
			setIsFocused(false);
		};

		console.log('introAnim', introAnim);

		return (
			<Animated.View style={{ transform: [{ translateY: introAnim }] }}>
				<Input
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					autoFocus={autoFocus}
					autoCapitalize={autoCapitalize}
					autoCorrect={autoCorrect}
					containerStyle={{ ...containerStyle, borderColor: isFocused ? '#0af' : '#303030' }}
					inputStyle={inputStyle}
					returnKeyType={returnKeyType}
					selectTextOnFocus={selectTextOnFocus}
					onSubmitEditing={onSubmitEditing}
					ref={ref}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
				/>
			</Animated.View>
		);
	}
);

const SignupScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { state, signup, clearErrorMessage } = useContext(AuthContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	// const [isFocused, setIsFocused] = useState('');
	const _passwordInput = useRef();

	const _next = () => {
		// use _passwordInput.current.focus instead of _passwordInput.focus
		_passwordInput && _passwordInput.current.focus();
	};

	const handleSignup = () => {
		setIsLoading(true);
		signup({ username, password, avatar: avatar.base64Uri });
	};

	useEffect(() => {
		if (state.errorMessage) setIsLoading(false);
	}, [state]);

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<Spacer>
				<FadeInView>
					<Text style={{ color: 'white', alignSelf: 'center', fontFamily: 'Snell Roundhand' }} h3>
						Sign Up
					</Text>
				</FadeInView>
				{/* <Text style={{ color: 'white', alignSelf: 'center', fontFamily: 'Savoye LET' }} h3>
					Sign Up
				</Text> */}
			</Spacer>
			<BouncyInput
				placeholder={'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={true}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				onSubmitEditing={_next}
			/>
			<Spacer />
			<BouncyInput
				placeholder={'password'}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				// ref={ref => (_passwordInput = ref)}
				ref={_passwordInput}
			/>
			<Spacer />
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'User'} displayName={username} />
			{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
			<Spacer />
			<Button title="Register User" disabled={!username || !password} onPress={handleSignup} />
			<NavLink routeName="Signin" text="Go back to Sign In" />
		</SafeAreaView>
	);
};

SignupScreen.navigationOptions = () => {
	return {
		header: null,
	};
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
		color: 'white',
	},
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		marginTop: 15,
	},
	input: {
		width: '75%',
		borderWidth: 1,
		borderRadius: 10,
		alignSelf: 'center',
	},
});

export default SignupScreen;
