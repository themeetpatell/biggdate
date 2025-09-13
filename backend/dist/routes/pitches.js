"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const pitches = [
    {
        id: '1',
        from: {
            name: 'Sarah Johnson',
            title: 'CTO & Co-Founder',
            company: 'HealthAI',
            location: 'Boston, MA',
            avatar: 'SJ',
            verified: true
        },
        subject: 'Potential Co-Founder Opportunity',
        message: 'Hi! I saw your profile and I think we\'d make an incredible team. I\'m building HealthAI, a platform that uses AI to revolutionize healthcare diagnostics. Your experience in scaling teams and your passion for impact-driven products really resonates with me. Would love to discuss how we could potentially work together!',
        receivedAt: '2 hours ago',
        read: false,
        status: 'new',
        compatibility: 92,
        sharedInterests: ['AI/ML', 'Healthcare', 'Impact'],
        mutualConnections: 3
    },
    {
        id: '2',
        from: {
            name: 'Mike Rodriguez',
            title: 'CEO & Founder',
            company: 'EcoTech',
            location: 'Austin, TX',
            avatar: 'MR',
            verified: true
        },
        subject: 'Sustainability & Innovation Partnership',
        message: 'Hello! I\'m building EcoTech, a cleantech startup focused on sustainable energy solutions. I noticed your passion for environmental causes and your track record in building successful companies. I believe our values align perfectly and we could create something amazing together. Would love to explore this opportunity!',
        receivedAt: '1 day ago',
        read: true,
        status: 'replied',
        compatibility: 88,
        sharedInterests: ['Sustainability', 'CleanTech', 'Innovation'],
        mutualConnections: 1
    },
    {
        id: '3',
        from: {
            name: 'Alex Chen',
            title: 'VP of Product',
            company: 'DataFlow Inc',
            location: 'Seattle, WA',
            avatar: 'AC',
            verified: false
        },
        subject: 'Product Strategy Collaboration',
        message: 'Hello! I\'ve been following your journey and I\'m impressed by your product strategy skills. I\'m looking for a co-founder who can help me scale DataFlow Inc to the next level. Your experience in building and scaling products would be invaluable. Would love to discuss this opportunity!',
        receivedAt: '3 days ago',
        read: true,
        status: 'archived',
        compatibility: 85,
        sharedInterests: ['Product Strategy', 'Scaling', 'Data'],
        mutualConnections: 0
    }
];
router.get('/', (req, res) => {
    try {
        const { status, search } = req.query;
        let filteredPitches = [...pitches];
        if (status && status !== 'all') {
            filteredPitches = filteredPitches.filter(pitch => pitch.status === status);
        }
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredPitches = filteredPitches.filter(pitch => pitch.from.name.toLowerCase().includes(searchTerm) ||
                pitch.subject.toLowerCase().includes(searchTerm) ||
                pitch.message.toLowerCase().includes(searchTerm));
        }
        res.json({
            success: true,
            data: {
                pitches: filteredPitches
            }
        });
    }
    catch (error) {
        console.error('Get pitches error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/reply', (req, res) => {
    try {
        const { pitchId, reply } = req.body;
        console.log(`Replying to pitch ${pitchId}:`, reply);
        res.json({
            success: true,
            message: 'Reply sent successfully'
        });
    }
    catch (error) {
        console.error('Reply to pitch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Marking pitch ${id} as read`);
        res.json({
            success: true,
            message: 'Pitch marked as read'
        });
    }
    catch (error) {
        console.error('Mark pitch as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/archive', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Archiving pitch ${id}`);
        res.json({
            success: true,
            message: 'Pitch archived successfully'
        });
    }
    catch (error) {
        console.error('Archive pitch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=pitches.js.map