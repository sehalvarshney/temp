package com.example.myapplication.data.model



data class LeadSummary(
    val id: String,
    val companyName: String,
    val location: String,
    val intentLevel: String, // e.g., "High Intent"
    val signalType: String,  // e.g., "Tender", "Expansion"
    val topProduct: String
)