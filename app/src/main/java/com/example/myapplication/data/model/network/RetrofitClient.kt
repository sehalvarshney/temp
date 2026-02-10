package com.example.myapplication.data.network



import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val BASE_URL = "https://hpclscraper.onrender.com/"

    // 1. Create a custom client that waits longer (90 seconds)
    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(90, TimeUnit.SECONDS) // Wait 90s for connection
        .readTimeout(90, TimeUnit.SECONDS)    // Wait 90s for data
        .writeTimeout(90, TimeUnit.SECONDS)
        .build()

    // 2. Use that client in Retrofit
    val instance: LeadApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient) // 👈 Tell Retrofit to use our patient client
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(LeadApiService::class.java)
    }
}