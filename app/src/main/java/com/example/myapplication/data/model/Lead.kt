package com.example.myapplication.data.model

import com.google.gson.annotations.SerializedName

data class Lead(
    @SerializedName("company_name") val companyName: String,
    @SerializedName("facility_location") val location: String,
    @SerializedName("recommended_products") val products: List<String>,
    @SerializedName("reason_code") val reason: String,
    @SerializedName("urgency") val urgency: String,
    @SerializedName("confidence_score") val confidence: Double,
    @SerializedName("suggested_action") val action: String
)