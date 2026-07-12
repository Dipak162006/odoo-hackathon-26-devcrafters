from odoo import models, fields

class TransitVehicle(models.Model):
    _name = 'transit.vehicle'
    _description = 'Transit Vehicle Profile'

    name = fields.Char(string='Vehicle Name', required=True)
    license_plate = fields.Char(string='License Plate', required=True)
    capacity = fields.Float(string='Capacity (kg)')
    status = fields.Selection([
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('maintenance', 'In Maintenance')
    ], string='Status', default='available')
