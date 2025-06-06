
// Fullscreen utility functions
class FullscreenManager {
    constructor() {
        this.isFullscreenIntended = false;
        this.init();
    }

    init() {
        // Listen for fullscreen change events
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));

        // Check if we should restore fullscreen on page load
        this.checkAndRestoreFullscreen();
    }

    handleFullscreenChange() {
        const isCurrentlyFullscreen = this.isCurrentlyFullscreen();
        
        // Update our intended state based on actual state
        if (!isCurrentlyFullscreen && this.isFullscreenIntended) {
            // Fullscreen was exited, update our intent
            this.setFullscreenIntent(false);
        }
    }

    isCurrentlyFullscreen() {
        return !!(document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement);
    }

    setFullscreenIntent(intent) {
        this.isFullscreenIntended = intent;
        if (intent) {
            sessionStorage.setItem('fullscreenIntent', 'true');
        } else {
            sessionStorage.removeItem('fullscreenIntent');
        }
    }

    getFullscreenIntent() {
        return sessionStorage.getItem('fullscreenIntent') === 'true';
    }

    async requestFullscreen() {
        try {
            this.setFullscreenIntent(true);
            
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                await document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                await document.documentElement.msRequestFullscreen();
            }
            return true;
        } catch (error) {
            console.warn('Failed to enter fullscreen:', error);
            this.setFullscreenIntent(false);
            return false;
        }
    }

    exitFullscreen() {
        this.setFullscreenIntent(false);
        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    checkAndRestoreFullscreen() {
        // Check if we should restore fullscreen on page load
        if (this.getFullscreenIntent() && !this.isCurrentlyFullscreen()) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                this.requestFullscreen();
            }, 100);
        }
    }

    // Method to handle navigation while maintaining fullscreen
    navigateWithFullscreen(url, delay = 0) {
        if (this.isCurrentlyFullscreen()) {
            this.setFullscreenIntent(true);
        }
        
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
}

// Create global instance
window.fullscreenManager = new FullscreenManager();
