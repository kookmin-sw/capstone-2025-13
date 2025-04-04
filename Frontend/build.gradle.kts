import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.github.node-gradle.node") version "7.1.0"
}

node {
    download.set(true)
    version.set("23.9.0")
    nodeProjectDir.set(file("${projectDir}/src/"))
}

tasks.withType<Jar> {
    enabled = false
}

tasks.withType<KotlinCompile> {
    enabled = false
}

tasks.create<NpmTask>("clean") {
    actions.clear()

    listOf("nodejs", "npm", "yarn").onEach { delete("${projectDir}/.gradle/$it") }
    listOf("out", "build").onEach { delete("${projectDir}/$it") }
}

tasks.register<NpmTask>("run") {
    npmCommand.set(listOf("run", "dev"))
    dependsOn("npmInstall")

    outputs.upToDateWhen { true }
}

tasks.register<NpmTask>("build") {
    npmCommand.set(listOf("run", "test"))
    dependsOn("npmInstall")

    outputs.upToDateWhen { true }
}

tasks.register<NpmTask>("lint") {
    npmCommand.set(listOf("run", "lint"))
    dependsOn("npmInstall")

    outputs.upToDateWhen { true }
}