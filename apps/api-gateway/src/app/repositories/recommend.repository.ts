import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import {
  IRecommendPostForStudentRequest,
  IRecommendTutorForStudentRequest,
} from '../types';

@Injectable()
export class RecommendRepository {
  private readonly client: Axios;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.RECOMMEND_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async recommendTutorForStudent({
    userId,
    ...params
  }: IRecommendTutorForStudentRequest) {
    const res = await this.client.get(
      `/student/tutor-recommendations/${userId}`,
      {
        params,
      }
    );

    return res.data?.recommendations ?? [];
  }

  async recommendPostForStudent({
    userId,
    ...params
  }: IRecommendPostForStudentRequest) {
    const res = await this.client.get(
      `/student/post-recommendations/${userId}`,
      {
        params,
      }
    );

    return res.data?.posts ?? [];
  }

  async recommendPostForTutor({
    userId,
    ...params
  }: IRecommendPostForStudentRequest) {
    const res = await this.client.get(`/tutor/post-recommendations/${userId}`, {
      params,
    });

    return res.data?.posts ?? [];
  }

  async recommendTutorForTutor({
    userId,
    ...params
  }: IRecommendPostForStudentRequest) {
    const res = await this.client.get(`/tutor/similar-tutors/${userId}`, {
      params,
    });

    return res.data?.recommendations ?? [];
  }
}
