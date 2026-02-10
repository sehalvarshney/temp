package com.example.myapplication.data.model

data class LeadDetail(
    val id: String, // 👈 THIS WAS MISSING
    val companyName: String,
    val location: String,
    val industry: String,
    val plant: String,
    val intent: String,
    val signalType: String,
    val sourceText: String,
    val recommendedProducts: List<RecommendedProduct>,
    val nextAction: String
)