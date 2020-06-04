from django.contrib import admin

from .models import Player

class CustomPlayerAdmin(admin.ModelAdmin):
    """
    Custom user admin page.
    """
    list_display = ('user', 'token', )
    list_display_links = ('token',)
    ordering = ('user', 'token', )
    list_filter = ('user', 'token',)
    search_fields = ('user',)
    filter_horizontal = ()

admin.site.register(Player, CustomPlayerAdmin)
