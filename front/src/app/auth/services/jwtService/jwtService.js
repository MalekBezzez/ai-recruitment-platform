import axios from 'axios';
import jwtDecode from 'jwt-decode'; 
import jwtServiceConfig from './jwtServiceConfig';

class JwtService {
  constructor() {
    this.listeners = {}; 

    
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('Erreur 401 détectée, déconnexion en cours...'); 
          /*this.logout(); 
          window.location.href = '/sign-up';*/ 
        }
        return Promise.reject(error);
      }
    );

   
    setInterval(() => {
      this.checkTokenExpiration();
    }, 30 * 1000); 
  }
  init() {
    this.handleAuthentication();
  }

  // Gestion de l'authentification
  handleAuthentication() {
    const token = localStorage.getItem('accessToken');

    if (token && this.isValidToken(token)) {
      this.emit('onAutoLogin');
    } else {
      this.emit('onNoAccessToken');
    }
  }
  // Méthode pour écouter les événements
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Méthode pour déclencher les événements
  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(...args));
    }
  }

  // Vérifie si le token est valide
  isValidToken(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime; // Vérifie si le token n'a pas expiré
    } catch (error) {
      return false;
    }
  }
  signInWithToken() {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (!accessToken || !storedUser) {
        reject(new Error('No access token or user found'));
        return;
      }

      try {
        //const user = JSON.parse(storedUser);

        if (!this.isValidToken(accessToken)) {
          this.logout();
          reject(new Error('Token expired, please log in again'));
          return;
        }

        // Ajouter le token aux en-têtes pour Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        resolve(user);
      } catch (error) {
        reject(new Error('Invalid user data'));
      }
    });
  }
  

  // Vérifie si le token est expiré
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token); // Décoder le token
      const expirationTime = decoded.exp * 1000; // Convertir en millisecondes
      const currentTime = Date.now(); // Temps actuel en millisecondes
      console.log('Expiration Time:', new Date(expirationTime)); // Log pour débogage
      console.log('Current Time:', new Date(currentTime)); // Log pour débogage
      return expirationTime < currentTime; // Vérifier si le token est expiré
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
      return true; // En cas d'erreur, considérer le token comme expiré
    }
  }

  // Vérifier l'expiration du token et rediriger si nécessaire
  checkTokenExpiration() {
    console.log('Vérification de l\'expiration du token...'); // Log pour débogage
    const token = localStorage.getItem('accessToken'); // Récupérer le token depuis le localStorage
    if (token && this.isTokenExpired(token)) {
      console.log('Token expiré, déconnexion en cours...'); // Log pour débogage
      this.logout(); // Déconnexion si le token est expiré
      window.location.href = '/sign-in'; // Rediriger vers la page de connexion
    }
  }

  // Connexion avec email et mot de passe
  signInWithEmailAndPassword(email, password) {
    return axios
      .post(jwtServiceConfig.signIn, { email, password })
      .then((response) => {
        // Vérifier si la réponse contient des données
        if (!response.data) {
          throw new Error('Aucune donnée reçue dans la réponse');
        }

        // Extraire le token et les informations utilisateur de la réponse
        const { access_token, user } = response.data;

        // Vérifier si le token et les informations utilisateur sont présents
        if (!access_token || !user) {
          throw new Error('Token ou informations utilisateur manquants dans la réponse');
        }

        // Stocker le token et les informations utilisateur dans le localStorage
        localStorage.setItem('accessToken', JSON.stringify(access_token));
        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage.getItem('accessToken'));
        console.log(localStorage.getItem('user'));
        
        // Ajouter le token aux en-têtes Axios pour les requêtes futures
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Émettre un événement de connexion réussie
        this.emit('onLogin', response.data);

        // Retourner les données de la réponse pour un usage ultérieur
        return response.data;
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error('Erreur lors de la connexion :', error);

        // Supprimer les données du localStorage en cas d'erreur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Retourner une erreur personnalisée
        throw error.response?.data?.errors || error.message || "Une erreur s'est produite lors de la connexion";
      });
  }

  // Déconnexion
  logout() {
    console.log('Déconnexion en cours...'); // Log pour débogage
    localStorage.removeItem('accessToken'); // Supprimer le token
    localStorage.removeItem('user'); // Supprimer les informations utilisateur
    delete axios.defaults.headers.common['Authorization']; // Supprimer le token des en-têtes Axios
    this.emit('onLogout', 'Logged out'); // Émettre un événement de déconnexion
    window.location.href = '/sign-in'; // Rediriger vers la page de connexion
  }

  // Récupérer le rôle de l'utilisateur depuis le token
  getRole() {
    const token = localStorage.getItem('accessToken'); // Récupérer le token

    if (token && this.isValidToken(token)) {
      try {
        const decoded = jwtDecode(token); // Décoder le token
        return decoded.role; // Retourner le rôle de l'utilisateur
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    }

    return null; // Retourner null si le token est invalide ou absent
  }
}

// Exporter une instance unique de JwtService
const instance = new JwtService();
export default instance;