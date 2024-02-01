import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { loginUser } from '../../services/auth.service';
import { MSG_FIELD_REQUIRED } from '../../common/constants';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Center,
  Alert,
  AlertTitle,
} from '@chakra-ui/react'
import { AlertIcon } from '@chakra-ui/react';

const Login = () => {
  const { setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setError] = useState({
    fieldErr: false,
    credentialsErr: false
  });
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const navigate = useNavigate();

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [field]: e.target.value
    });
  }

  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    onLogin();
  }

  const onLogin = () => {
    if (!form.email || !form.password) return setError({ ...formErrors, fieldErr: true });
    setLoadingState(true);

    loginUser(form.email, form.password)
      .then(credential => {
        setContext(prevState => ({
          ...prevState,
          user: credential.user,
        }));
      })
      .then(() => {
        navigate('/');
      })
      .then(() => setLoadingState(false))
      .catch(e => {
        setLoadingState(false);
        setError({ ...formErrors, credentialsErr: true });
        console.error(e.message);
      });
  };

  return (
    <Flex
      maxH={'fit-content'}
      justify={'center'}
      bg={'none'}
      onKeyDown={e => onKeyEnter(e)}>
      <Stack spacing={8}
        w={{ base: '90%', sm: '80%', lg: '60%', xl: '35%' }}
        mx={'auto'}
        minW={'28vw'}
        maxW={'lg'}
        backgroundColor={'grey'} rounded={'lg'}>
        <Box justifyContent={'center'} textAlign={'center'} mt={5} p={0}>
          <Heading m={0} p={0} fontSize={'4xl'}>Login</Heading>
        </Box>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={10}>
          <Stack spacing={4}>
            <FormControl id='email' isRequired isInvalid={formErrors.fieldErr && !form.email}>
              <Center>
                <FormLabel mb={1} mr={0} fontSize={'lg'}>Email</FormLabel>
              </Center>
              <Input
                borderColor={'grey'}
                bg={'white'}
                rounded="md"
                type='text'
                placeholder={formErrors.fieldErr && !form.email ? MSG_FIELD_REQUIRED : ''}
                textAlign={'center'}
                onChange={updateForm('email')} />
            </FormControl>
            <FormControl id='password' isRequired isInvalid={formErrors.fieldErr && !form.password}>
              <Center>
                <FormLabel mb={1} mr={0} fontSize={'lg'}>Password</FormLabel>
              </Center>
              <Input
                borderColor={'grey'}
                type={'password'}
                bg={'white'}
                rounded="md"
                placeholder={formErrors.fieldErr && !form.password ? MSG_FIELD_REQUIRED : ''}
                textAlign={'center'}
                onChange={updateForm('password')} />
            </FormControl>
            {
              formErrors.credentialsErr &&
              <Alert status='error'>
                <AlertIcon />
                <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
                  <AlertTitle>Wrong email or password</AlertTitle>
                </Box>
              </Alert>
            }
            <Stack spacing={8}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Stack direction={'column'} margin={'auto'}>
                  <Box display={'block'}>
                    <Text fontSize={'sm'} textAlign={'center'}>Don&apos;t have an account?</Text>
                  </Box>
                  <Text fontSize={'sm'} textAlign={'center'}>
                    You should <Link fontSize={'md'} color={'#0059cb'} onClick={() => navigate('/register')}>Register</Link>!
                  </Text>
                </Stack>
              </Stack>
              <Button
                onClick={onLogin}
                isLoading={loadingState}
                bg={'teal.500'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack >
    </Flex >
  );
}

export default Login;