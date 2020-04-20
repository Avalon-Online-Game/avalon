from django.db import migrations

ROLES = (
    {'name': 'loyal1', 'side': 'good'},
    {'name': 'loyal2', 'side': 'good'},
    {'name': 'loyal3', 'side': 'good'},
    {'name': 'loyal4', 'side': 'good'},
    {'name': 'loyal5', 'side': 'good'},
    {'name': 'percival', 'side': 'good'},
    {'name': 'merlin', 'side': 'good'},
    {'name': 'minion1', 'side': 'evil'},
    {'name': 'minion2', 'side': 'evil'},
    {'name': 'minion3', 'side': 'evil'},
    {'name': 'mordred', 'side': 'evil'},
    {'name': 'assassin', 'side': 'evil'},
    {'name': 'morgana', 'side': 'evil'},
    {'name': 'oberon','side': 'evil'},
)

def create_roles(apps, schema_editor):
    Role = apps.get_model('games', 'Role')
    for role_data in ROLES:
        Role.objects.create(**role_data)


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_roles),
    ]
