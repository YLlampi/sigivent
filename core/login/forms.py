from django import forms
from django.contrib.auth import authenticate
from core.user.models import User
import requests


class AuthenticationForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Ingrese un username',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Ingrese un password',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    def get_or_create_user_api(self, username, password):
        response = {'resp': False, 'msg': 'No se ha podido iniciar sesión'}
        try:
            payload = {
                'username': username,
                'password': password,
            }
            headers = {'Authorization': 'Token 18c895c9139fba860a352a32aa4232986d8f3743'}
            r = requests.post('http://127.0.0.1:8000/api/login/', data=payload, headers=headers)
            if r.status_code == 200:
                response = r.json()
                if response['resp']:
                    queryset = User.objects.filter(username=response['user']['username'])
                    if not queryset.exists():
                        user = User()
                        user.username = response['user']['username']
                        user.first_name = response['user']['first_name']
                        user.last_name = response['user']['last_name']
                        user.email = response['user']['email']
                        user.set_password(response['user']['username'])
                        user.is_superuser = True
                        user.is_staff = True
                        user.save()
            else:
                response['msg'] = r.text
        except Exception as e:
            response = {'resp': False, 'msg': str(e)}
        return response

    def clean(self):
        cleaned = super().clean()
        username = cleaned.get('username', '')
        password = cleaned.get('password', '')
        if len(username) == 0:
            raise forms.ValidationError('Ingrese su username')
        elif len(password) == 0:
            raise forms.ValidationError('Ingrese su password')
        # response_api = self.get_or_create_user_api(username=username, password=password)
        # if not response_api.get('resp'):
        #     raise forms.ValidationError(response_api.get('msg'))
        user = authenticate(username=username, password=password)
        if user is None:
            raise forms.ValidationError('Por favor introduzca el nombre de usuario y la clave correctos para una cuenta de personal. Observe que ambos campos pueden ser sensibles a mayúsculas.')
        return cleaned

    def get_user(self):
        username = self.cleaned_data.get('username')
        return User.objects.get(username=username)


class ResetPasswordForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Ingrese un username',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    def clean(self):
        cleaned = super().clean()
        if not User.objects.filter(username=cleaned['username']).exists():
            # self._errors['error'] = self._errors.get('error', self.error_class())
            # self._errors['error'].append('El usuario no existe')
            raise forms.ValidationError('El usuario no existe')
        return cleaned

    def get_user(self):
        username = self.cleaned_data.get('username')
        return User.objects.get(username=username)


class ChangePasswordForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Ingrese un password',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    confirmPassword = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Repita el password',
        'class': 'form-control',
        'autocomplete': 'off'
    }))

    def clean(self):
        cleaned = super().clean()
        password = cleaned['password']
        confirmPassword = cleaned['confirmPassword']
        if password != confirmPassword:
            # self._errors['error'] = self._errors.get('error', self.error_class())
            # self._errors['error'].append('El usuario no existe')
            raise forms.ValidationError('Las contraseñas deben ser iguales')
        return cleaned
