import {useState} from 'react';

import { createClub, loginClub } from '@/services/clubService';
import {useToastStore} from "@/store/toast";

interface ClubRequest {
  clubName: string;
  ownerId: string;
  password: string;
}

export const useCreateClub = () => {
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const { addToast } = useToastStore();
  const create = async ({
    clubName,
    ownerId,
    password,
  }: ClubRequest) => {
    try {
      const club = await createClub(clubName, ownerId, password);
      setCurrentClub(club);
    } catch (error) {
      console.error(error);
      addToast('Failed to create a club', 'error');
    }
  };

  return { create, currentClub };
}

export const useLoginClub = () => {
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const { addToast } = useToastStore();
  const login = async (ownerId: string, password: string) => {
    try {
      const club = await loginClub(ownerId, password);
      setCurrentClub(club);
    } catch (error) {
      console.error(error);
      addToast('Failed to login', 'error');
    }
  };

  return { login, currentClub };
}
