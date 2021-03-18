from django.conf.urls import url
from . import views

app_name = 'api'

urlpatterns = [
    url(r'^$',views.apiOverview,name="overview"),
    url(r'^notes-list/$',views.noteList,name="notes-list"),
    url(r'^note-detail/(?P<pk>\d+)/$',views.noteDetail,name="note-detail"),
    url(r'^create-note/$',views.noteCreate,name="create-note"),
    url(r'^update-note/(?P<pk>\d+)/$',views.noteUpdate,name="update-note"),
    url(r'^delete-note/(?P<pk>\d+)/$',views.noteDelete,name="delete-note"),
]
