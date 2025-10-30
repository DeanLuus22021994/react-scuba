{{/*
Expand the name of the chart.
*/}}
{{- define "react-scuba.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "react-scuba.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "react-scuba.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "react-scuba.labels" -}}
helm.sh/chart: {{ include "react-scuba.chart" . }}
{{ include "react-scuba.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
tenant: {{ .Values.global.tenantId }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "react-scuba.selectorLabels" -}}
app.kubernetes.io/name: {{ include "react-scuba.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
tenant: {{ .Values.global.tenantId }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "react-scuba.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "react-scuba.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
API image name
*/}}
{{- define "react-scuba.apiImage" -}}
{{- printf "%s/%s:%s" .Values.global.imageRegistry .Values.api.image.repository .Values.api.image.tag }}
{{- end }}

{{/*
Web image name
*/}}
{{- define "react-scuba.webImage" -}}
{{- printf "%s/%s:%s" .Values.global.imageRegistry .Values.web.image.repository .Values.web.image.tag }}
{{- end }}

{{/*
Database connection string (without password)
*/}}
{{- define "react-scuba.databaseHost" -}}
{{- printf "%s:%d" .Values.database.host (.Values.database.port | int) }}
{{- end }}

{{/*
Redis connection string
*/}}
{{- define "react-scuba.redisHost" -}}
{{- printf "%s:%d" .Values.cache.redis.host (.Values.cache.redis.port | int) }}
{{- end }}
