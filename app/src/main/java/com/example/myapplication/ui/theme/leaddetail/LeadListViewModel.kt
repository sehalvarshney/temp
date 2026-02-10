package com.example.myapplication.ui.leaddetail

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.LeadSummary
import com.example.myapplication.data.model.repository.LeadRepository
import kotlinx.coroutines.launch

// This defines the UI State (Loading, Success, Error)
sealed class LeadListUiState {
    object Loading : LeadListUiState()
    data class Success(val leads: List<LeadSummary>) : LeadListUiState()
    data class Error(val message: String) : LeadListUiState()
}

class LeadListViewModel : ViewModel() {

    private val repo = LeadRepository()

    var uiState by mutableStateOf<LeadListUiState>(LeadListUiState.Loading)
        private set

    init {
        loadLeads()
    }

    fun loadLeads() {
        viewModelScope.launch {
            uiState = LeadListUiState.Loading
            try {
                val result = repo.getLeads()
                if (result.isNotEmpty()) {
                    uiState = LeadListUiState.Success(result)
                } else {
                    uiState = LeadListUiState.Error("Connected, but found 0 leads.")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                uiState = LeadListUiState.Error("Failed: ${e.message}")
            }
        }
    }
}