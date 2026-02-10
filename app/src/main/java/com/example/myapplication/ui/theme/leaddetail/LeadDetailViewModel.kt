package com.example.myapplication.ui.leaddetail

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.LeadDetail
import com.example.myapplication.data.model.repository.LeadRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// 1. Define the States (Loading, Success, Error)
sealed class LeadUiState {
    object Loading : LeadUiState()
    // ✅ FIX: This must hold 'LeadDetail', not 'Unit'
    data class Success(val data: LeadDetail) : LeadUiState()
    data class Error(val message: String) : LeadUiState()
}

class LeadDetailViewModel : ViewModel() {

    private val repo = LeadRepository()

    // 2. Use the State Wrapper
    var uiState by mutableStateOf<LeadUiState>(LeadUiState.Loading)
        private set

    // ✅ FIX: Added 'id' parameter so we know which lead to load
    fun loadLead(id: String) {
        viewModelScope.launch {
            // Set state to Loading to trigger the spinner
            uiState = LeadUiState.Loading

            try {
                // Simulate a slight network delay (Optional, looks nice)
                delay(500)

                // ✅ FIX: Fetch REAL data from Repository
                val result = repo.getLeadDetail(id)

                // Update state to Success
                uiState = LeadUiState.Success(result)

            } catch (e: Exception) {
                // If it fails, show the error message
                e.printStackTrace()
                uiState = LeadUiState.Error("Failed: ${e.message}")

                // OPTIONAL: If you want to force a Mock Lead when offline, uncomment this:
                // uiState = LeadUiState.Success(getMockLeadDetail(id))
            }
        }
    }

    // (Optional) Helper to generate fake data if internet fails
    // Find this function at the bottom of LeadDetailViewModel.kt
    private fun getMockLeadDetail(id: String): LeadDetail {
        // 👇 DELETE the line that says TODO("...")
        // 👇 PASTE this instead:

        return LeadDetail(
            id = id,
            companyName = "Mock Company Ltd",
            location = "Mumbai, India",
            industry = "Manufacturing",
            plant = "Unit 4",
            intent = "High Intent",
            signalType = "Expansion",
            sourceText = "This is a placeholder lead because the internet connection failed or the server is sleeping.",
            recommendedProducts = emptyList(), // Return an empty list for now
            nextAction = "Call Now"
        )
    }
}