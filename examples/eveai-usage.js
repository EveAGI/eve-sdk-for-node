/**
 * Eve.AI SDK Usage Examples
 * 
 * Complete examples for all Eve.AI services
 */

const { Client, EveAITask, EveAIPayment, EveAIChat, EveAIProviderDiscovery } = require('../dist');

// Initialize client
const client = new Client()
    .setEndpoint('http://localhost:37000/v1/douyin')
    .setToken('your-auth-token-here');

// Initialize Eve.AI services
const taskService = new EveAITask(client);
const paymentService = new EveAIPayment(client);
const chatService = new EveAIChat(client);
const providerDiscovery = new EveAIProviderDiscovery(client);

// ==================== Task Service ====================

async function createTask() {
    try {
        const task = await taskService.createTask(
            'Flat Tire Assistance',
            'Need help changing a flat tire on Highway 101',
            'Roadside Assistance',
            {
                latitude: 37.7749,
                longitude: -122.4194,
                address: 'Highway 101, CA'
            },
            'urgent',
            85.00
        );
        console.log('Task created:', task);
        return task.task.id;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function analyzeVoice() {
    try {
        const fs = require('fs');
        const audioData = fs.readFileSync('./audio-recording.mp3');
        
        const analysis = await taskService.analyzeVoice(audioData, 'mp3');
        console.log('Voice analysis:', analysis);
        console.log('Transcription:', analysis.analysis.transcription);
        console.log('Suggested category:', analysis.analysis.suggested_category);
        console.log('Estimated price:', analysis.analysis.estimated_price);
    } catch (error) {
        console.error('Error analyzing voice:', error);
    }
}

async function analyzeImage() {
    try {
        const fs = require('fs');
        const imageData = fs.readFileSync('./damage-photo.jpg');
        
        const analysis = await taskService.analyzeImage(imageData, 'jpg');
        console.log('Image analysis:', analysis);
        console.log('Detected objects:', analysis.analysis.detected_objects);
        console.log('Scene description:', analysis.analysis.scene_description);
    } catch (error) {
        console.error('Error analyzing image:', error);
    }
}

async function getNearbyTasks() {
    try {
        const tasks = await taskService.getNearbyTasks(
            37.7749,  // latitude
            -122.4194, // longitude
            25,        // radius in miles
            'Roadside Assistance' // category filter (optional)
        );
        console.log('Found', tasks.tasks.length, 'nearby tasks');
        tasks.tasks.forEach(task => {
            console.log('-', task.title, '($' + task.estimated_price + ')');
        });
    } catch (error) {
        console.error('Error getting nearby tasks:', error);
    }
}

// ==================== Payment Service ====================

async function calculatePrice() {
    try {
        const calculation = await paymentService.calculatePrice(
            100.00, // base amount
            15.00,  // tip
            true    // is member
        );
        console.log('Price breakdown:', calculation.breakdown);
        console.log('Total:', calculation.total);
        console.log('Platform fee:', calculation.platform_fee);
        console.log('Discount:', calculation.discount);
    } catch (error) {
        console.error('Error calculating price:', error);
    }
}

async function subscribeToMembership() {
    try {
        const subscription = await paymentService.subscribe('pm_card_visa');
        console.log('Subscription created:', subscription);
        console.log('Status:', subscription.subscription.status);
        console.log('Period end:', subscription.subscription.current_period_end);
    } catch (error) {
        console.error('Error subscribing:', error);
    }
}

async function getEarnings() {
    try {
        const earnings = await paymentService.getEarnings();
        console.log('Total earnings:', earnings.total_earnings);
        console.log('Available balance:', earnings.available_balance);
        console.log('Breakdown:', earnings.breakdown);
    } catch (error) {
        console.error('Error getting earnings:', error);
    }
}

// ==================== Chat Service ====================

async function sendChatMessage() {
    try {
        const message = await chatService.sendMessage(
            'conv_123',
            'When can you arrive?',
            'text'
        );
        console.log('Message sent:', message);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function getConversations() {
    try {
        const conversations = await chatService.listConversations(1, 20);
        console.log('Conversations:', conversations.conversations.length);
        conversations.conversations.forEach(conv => {
            console.log('-', conv.id, '(', conv.unread_count, 'unread)');
        });
    } catch (error) {
        console.error('Error getting conversations:', error);
    }
}

// ==================== Provider Discovery ====================

async function discoverAndContactProviders() {
    try {
        // 1. Search for providers
        console.log('🔍 Searching for providers...');
        const searchResult = await providerDiscovery.searchProvidersForTask(
            'task_123',
            'Roadside Assistance',
            'Highway 101, CA',
            25,  // radius miles
            20   // max results
        );
        
        console.log('Found', searchResult.providers.length, 'providers:');
        searchResult.providers.forEach(provider => {
            console.log('-', provider.name, '(', provider.rating, '★)');
        });
        
        // 2. Contact providers with AI-generated messages
        console.log('\n📧 Contacting providers...');
        const contactResult = await providerDiscovery.contactProviders(
            searchResult.search_id,
            'task_123',
            {
                title: 'Flat Tire Assistance',
                description: 'Need help changing a flat tire',
                category: 'Roadside Assistance',
                location: 'Highway 101, CA',
                estimatedPrice: 85.00,
                urgency: 'urgent'
            },
            10 // contact top 10 providers
        );
        
        console.log('Contacted', contactResult.providers_contacted, 'providers');
        console.log('Methods used:', contactResult.attempts.map(a => a.method).join(', '));
        
        // 3. Check conversion stats
        const stats = await providerDiscovery.getConversionStats(searchResult.search_id);
        console.log('\n📊 Conversion Stats:');
        console.log('- Contacted:', stats.stats.total_contacted);
        console.log('- Clicked:', stats.stats.total_clicked);
        console.log('- Downloaded:', stats.stats.total_downloaded);
        console.log('- Registered:', stats.stats.total_registered);
        console.log('- Active:', stats.stats.total_active);
        console.log('- Conversion Rate:', (stats.stats.conversion_rate * 100).toFixed(2) + '%');
        
    } catch (error) {
        console.error('Error in provider discovery:', error);
    }
}

// ==================== Complete Workflow ====================

async function completeTaskWorkflow() {
    try {
        console.log('=== Eve.AI Complete Workflow ===\n');
        
        // 1. Create task with AI analysis
        console.log('1. Creating task...');
        const taskId = await createTask();
        
        // 2. Calculate pricing
        console.log('\n2. Calculating price...');
        await calculatePrice();
        
        // 3. Discover and contact providers
        console.log('\n3. Finding providers...');
        await discoverAndContactProviders();
        
        // 4. Chat with provider
        console.log('\n4. Starting chat...');
        await sendChatMessage();
        
        console.log('\n✅ Workflow complete!');
    } catch (error) {
        console.error('Error in workflow:', error);
    }
}

// Run examples
if (require.main === module) {
    completeTaskWorkflow();
}

module.exports = {
    createTask,
    analyzeVoice,
    analyzeImage,
    getNearbyTasks,
    calculatePrice,
    subscribeToMembership,
    getEarnings,
    sendChatMessage,
    getConversations,
    discoverAndContactProviders,
    completeTaskWorkflow
};
