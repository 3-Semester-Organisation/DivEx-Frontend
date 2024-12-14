import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;          // note: check if int or string
  subscriptionType: string;
  
}

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.userId;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
}

export function getSubscriptionTypeFromToken(): string | null { 
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.subscriptionType;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
}