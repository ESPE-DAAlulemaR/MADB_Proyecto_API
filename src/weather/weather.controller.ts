import { Controller, Get, Query } from '@nestjs/common';
import * as moment from 'moment';

@Controller('weather')
export class WeatherController {
  @Get()
  async getWeather(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate?: string,
  ) {
    if (!startDate && !endDate) {
      return { error: 'Debes proporcionar al menos una fecha.' };
    }

    const startMoment = startDate ? moment(startDate, 'YYYY/MM/DD HH:mm:ss') : moment();
    const endMoment = endDate ? moment(endDate, 'YYYY/MM/DD HH:mm:ss') : moment(startMoment);

    const weatherData = await this.getWeatherData(startMoment, endMoment);

    return weatherData;
  }

  async getWeatherData(startMoment: moment.Moment, endMoment: moment.Moment) {
    const weatherData = [];

    const firstDay = startMoment.format('YYYY/MM/DD');
    const firstDayWeather = this.generateWeatherDetail();
    weatherData.push({ date: firstDay, ...firstDayWeather });

    if (endMoment.diff(startMoment, 'days') > 0) {
      const lastDay = endMoment.format('YYYY/MM/DD');
      const lastDayWeather = this.generateWeatherDetail();
      weatherData.push({ date: lastDay, ...lastDayWeather });
    }

    return weatherData;
  }

  generateWeatherDetail() {
    const temperature = this.generateRandomNumber(10, 30);
    const humidity = this.generateRandomNumber(40, 80);
    const windSpeed = this.generateRandomNumber(0, 20);
    const weatherState = this.generateWeatherState();

    return {
      temperature: temperature + '°C',
      humidity: humidity + '%',
      windSpeed: windSpeed + 'km/h',
      state: weatherState
    };
  }

  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateWeatherState(): string {
    const randomNumber = Math.random();
    if (randomNumber < 0.3) {
      return 'soleado';
    } else if (randomNumber < 0.6) {
      return 'nublado';
    } else if (randomNumber < 0.8) {
      return 'lluvioso';
    } else {
      return 'tormenta';
    }
  }
}
