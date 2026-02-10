package com.example.myapplication.data.network

import com.example.myapplication.data.model.Lead
import retrofit2.http.GET

interface LeadApiService {
    // Fetches data from https://hpclscraper.onrender.com/
    @GET(".")
    suspend fun getLeads(): List<Lead>
}