package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.BackHandler // 👈 Simpler way to handle Back button
import androidx.compose.runtime.*
import com.example.myapplication.ui.leaddetail.LeadListScreen
import com.example.myapplication.ui.theme.leaddetail.LeadDetailScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            // State: "null" means show List. A String ID means show Detail.
            var selectedLeadId by remember { mutableStateOf<String?>(null) }

            // Screen Switcher
            if (selectedLeadId == null) {
                // 1. Show List
                LeadListScreen(
                    onLeadClick = { id -> selectedLeadId = id }
                )
            } else {
                // 2. Show Detail

                // This handles the SYSTEM "Back" button (bottom of phone)
                BackHandler {
                    selectedLeadId = null
                }

                LeadDetailScreen(
                    leadId = selectedLeadId!!,
                    // This handles the APP BAR "Back" arrow (top left)
                    onBackClick = { selectedLeadId = null }
                )
            }
        }
    }
}