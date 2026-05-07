package com.github.gubbib.backend.Service.EveryTime;

public interface EverytimeClient
{
    String fetchTimetable(String cookie, int startNum, int limitNum);
}
