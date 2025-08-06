class AdminDashboardApp {
    constructor() {
        this.init();
    }

    init() {
        this.loadClientStats();
    }

    async loadClientStats() {
        try {
            const response = await fetch('/api/tenants.php');
            const tenants = await response.json();

            if (response.ok) {
                this.updateClientStats(tenants);
            } else {
                console.error('Error loading client stats:', tenants.error);
            }
        } catch (error) {
            console.error('Error loading client stats:', error);
        }
    }

    updateClientStats(tenants) {
        const totalClients = tenants.length;
        const activeClients = tenants.filter(tenant => tenant.active).length;
        
        // Calculate new clients this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newClientsThisMonth = tenants.filter(tenant => {
            const createdDate = new Date(tenant.created_at);
            return createdDate.getMonth() === currentMonth && 
                   createdDate.getFullYear() === currentYear;
        }).length;

        // Update UI
        document.getElementById('totalClients').textContent = totalClients;
        document.getElementById('activeClients').textContent = activeClients;
        document.getElementById('newClientsThisMonth').textContent = newClientsThisMonth;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboardApp();
});