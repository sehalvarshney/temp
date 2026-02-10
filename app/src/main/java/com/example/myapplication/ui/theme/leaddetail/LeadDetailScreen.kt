package com.example.myapplication.ui.theme.leaddetail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
// 👇 THIS IS THE CRITICAL IMPORT YOU WERE MISSING
import com.example.myapplication.ui.leaddetail.LeadDetailViewModel
import com.example.myapplication.ui.leaddetail.LeadUiState
import com.example.myapplication.data.model.LeadDetail
import com.example.myapplication.data.model.RecommendedProduct

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeadDetailScreen(
    leadId: String,
    onBackClick: () -> Unit,
    viewModel: LeadDetailViewModel = viewModel()
) {
    // 1. Trigger the data load as soon as the screen opens
    LaunchedEffect(leadId) {
        viewModel.loadLead(leadId)
    }

    val state = viewModel.uiState

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Lead Details", fontSize = 18.sp) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {

            // 2. Switch between Loading, Success, and Error
            when (state) {
                is LeadUiState.Loading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }

                is LeadUiState.Error -> {
                    Column(
                        modifier = Modifier.align(Alignment.Center),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("❌ Error loading data", color = Color.Red)
                        Text(state.message, color = Color.Gray, fontSize = 12.sp)
                        Button(onClick = { viewModel.loadLead(leadId) }) {
                            Text("Retry")
                        }
                    }
                }

                is LeadUiState.Success -> {
                    // Show the actual data
                    LeadDetailContent(state.data)
                }
            }
        }
    }
}

// 3. The Content UI (Separated for cleaner code)
@Composable
fun LeadDetailContent(lead: LeadDetail) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section 1: Header Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD)) // Light Blue
            ) {
                Column(Modifier.padding(16.dp)) {
                    Text(lead.companyName, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0D47A1))
                    Text("📍 ${lead.location}", color = Color.DarkGray)
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Badge(lead.intent)
                        Badge(lead.signalType)
                    }
                }
            }
        }

        // Section 2: Why This Lead?
        item {
            Text("Why This Lead?", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Text(
                    text = lead.sourceText,
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        // Section 3: Recommended Products
        item {
            Text("Recommended Products", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        items(lead.recommendedProducts) { product ->
            ProductItem(product)
        }

        // Section 4: Action Button
        item {
            Spacer(Modifier.height(16.dp))
            Button(
                onClick = { /* Handle Call */ },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)) // Green
            ) {
                Text(lead.nextAction)
            }
        }
    }
}

// Helper: Product Item Row
@Composable
fun ProductItem(product: RecommendedProduct) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(product.name, fontWeight = FontWeight.SemiBold)
                Text(product.reason, fontSize = 12.sp, color = Color.Gray)
            }
            Text(
                text = product.confidence,
                color = Color(0xFF2E7D32),
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        }
    }
}

// Helper: Simple Badge
@Composable
fun Badge(text: String) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(4.dp),
        tonalElevation = 2.dp
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold
        )
    }
}