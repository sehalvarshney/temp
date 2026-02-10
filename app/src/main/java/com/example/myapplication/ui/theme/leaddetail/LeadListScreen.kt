package com.example.myapplication.ui.leaddetail

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.data.model.LeadSummary

// 👇 DEBUG VERSION OF THE SCREEN
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeadListScreen(
    onLeadClick: (String) -> Unit,
    viewModel: LeadListViewModel = viewModel()
) {
    val state = viewModel.uiState

    Scaffold(
        topBar = { TopAppBar(title = { Text("New Leads") }) }
    ) { padding ->
        Box(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            when (state) {
                is LeadListUiState.Loading -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator()
                        Spacer(Modifier.height(16.dp))
                        Text("Connecting to Server...")
                        Text("(This may take 60 seconds)", color = Color.Gray)
                    }
                }
                is LeadListUiState.Error -> {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("❌ ERROR OCCURRED", color = Color.Red)
                        Text(state.message)
                        Button(onClick = { viewModel.loadLeads() }) {
                            Text("Retry")
                        }
                    }
                }
                is LeadListUiState.Success -> {
                    if (state.leads.isEmpty()) {
                        Text("✅ Connected, but found 0 leads.")
                    } else {
                        LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                            items(state.leads) { lead ->
                                LeadListCard(lead = lead, onClick = { onLeadClick(lead.id) })
                                Spacer(Modifier.height(12.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
@Composable
fun LeadListCard(lead: LeadSummary, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(Modifier.padding(16.dp)) {
            // Header Row
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = lead.companyName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Text(
                        text = lead.location,
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
                Text(">", color = Color.Gray, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(12.dp))

            // Badges Row
            Row {
                // Determine color based on intent
                val (bgColor, txtColor) = if (lead.intentLevel.contains("High")) {
                    Color(0xFFFFEBEE) to Color(0xFFD32F2F) // Red for High
                } else {
                    Color(0xFFFFF3E0) to Color(0xFFE65100) // Orange for Medium
                }

                Badge(text = lead.intentLevel, backgroundColor = bgColor, textColor = txtColor)
                Spacer(Modifier.width(8.dp))
                Badge(text = lead.signalType, backgroundColor = Color(0xFFF5F5F5), textColor = Color.Black)
            }

            Spacer(Modifier.height(12.dp))

            // Product Box
            ProductBox(productName = lead.topProduct)
        }
    }
}

// You might also need these helper composables if they are missing:

@Composable
fun Badge(text: String, backgroundColor: Color, textColor: Color) {
    Surface(
        color = backgroundColor,
        shape = RoundedCornerShape(4.dp),
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = textColor,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun ProductBox(productName: String) {
    Box(
        Modifier
            .fillMaxWidth()
            .background(Color(0xFFE3F2FD), RoundedCornerShape(4.dp)) // Light Blue
            .border(1.dp, Color(0xFFBBDEFB), RoundedCornerShape(4.dp))
            .padding(8.dp)
    ) {
        Column {
            Text("Top Recommended Product", fontSize = 12.sp, color = Color(0xFF1565C0))
            Text(productName, fontWeight = FontWeight.SemiBold, color = Color(0xFF0D47A1))
        }
    }
}

