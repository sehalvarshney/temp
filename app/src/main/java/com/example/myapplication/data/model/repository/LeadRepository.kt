package com.example.myapplication.data.model.repository

import com.example.myapplication.data.model.LeadSummary
import com.example.myapplication.data.model.LeadDetail
import com.example.myapplication.data.model.RecommendedProduct
import com.example.myapplication.data.network.RetrofitClient

class LeadRepository {
    private val api = RetrofitClient.instance

    // 👇 THIS IS THE FIX: 'companion object' makes this list shared across screens
    companion object {
        private var cachedLeads = listOf<com.example.myapplication.data.model.Lead>()
    }

    suspend fun getLeads(): List<LeadSummary> {
        // If we already have data, don't fetch it again (Optional optimization)
        if (cachedLeads.isNotEmpty()) {
            return mapLeadsToSummary(cachedLeads)
        }

        // Fetch from API
        cachedLeads = api.getLeads()
        return mapLeadsToSummary(cachedLeads)
    }

    suspend fun getLeadDetail(id: String): LeadDetail {
        // Now this will find the data because cachedLeads is shared!
        val lead = cachedLeads.find { it.companyName == id }
            ?: throw Exception("Lead not found. Please refresh the list.")

        return LeadDetail(
            id = lead.companyName,
            companyName = lead.companyName,
            location = lead.location,
            industry = "Energy/Transport",
            plant = "Main Facility",
            intent = "${lead.urgency} Intent",
            signalType = "Expansion",
            sourceText = lead.reason,
            recommendedProducts = lead.products.map { name ->
                RecommendedProduct(name, "${(lead.confidence * 10).toInt()}%", "High Match")
            },
            nextAction = lead.action
        )
    }

    private fun mapLeadsToSummary(leads: List<com.example.myapplication.data.model.Lead>): List<LeadSummary> {
        return leads.map { lead ->
            LeadSummary(
                id = lead.companyName,
                companyName = lead.companyName,
                location = lead.location,
                intentLevel = "${lead.urgency} Intent",
                signalType = "Expansion",
                topProduct = lead.products.firstOrNull() ?: "Fuel"
            )
        }
    }
}